import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient, MutationFunction } from '@tanstack/react-query';
import { PersonData } from '../../utils/types';
import { updatePartnerId } from '../../utils/transformer';
import {
  FormTitle,
  FormGroup,
  Label,
  Input,
  Select,
  Actions,
  ErrorMessage,
  SubmitButton,
  CancelButton,
} from './styles';

interface NewPersonFormProps {
  onPersonAdded: (person: PersonData) => void;
  selectedPerson: PersonData | null;
  setSelectedPerson: (person: PersonData | null) => void;
  onEditPerson: (person: PersonData) => void;
  onDeletePerson: (id: number) => void;
  persons: PersonData[];
  setPersons: (persons: PersonData[]) => void;
  setIsOpen: (o: boolean) => void;
  availableIds: number[];
  person?: PersonData | null;
}

const fetchPersonIds = async (): Promise<number[]> => {
  const response = await fetch('http://localhost:3001/api/person/ids');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const createPerson: MutationFunction<PersonData, PersonData> = async (personData: PersonData) => {
  const response = await fetch('http://localhost:3001/api/person', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(personData),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const NewPersonForm: React.FC<NewPersonFormProps> = ({
  onPersonAdded,
  selectedPerson,
  setSelectedPerson,
  onEditPerson,
  persons,
  setPersons,
  setIsOpen,
  availableIds,
  person,
}) => {
  const queryClient = useQueryClient();
  const { isLoading, error } = useQuery<number[]>({
    queryKey: ['personIds'],
    queryFn: fetchPersonIds,
  });

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
    defaultValues: person ? {
      id: person.id,
      name: person.name,
      gender: person.gender,
      partnerId: person.partnerId ?? "null",
      fatherId: person.fatherId ?? "null",
      motherId: person.motherId ?? "null",
    } : {}
   });

  useEffect(() => {
    if (selectedPerson) {
      setValue('id', selectedPerson.id); 
      setValue('name', selectedPerson.name);
      setValue('gender', selectedPerson.gender);
      setValue('partnerId', selectedPerson.partnerId ?? "null");
      setValue('fatherId', selectedPerson.fatherId ?? "null");
      setValue('motherId', selectedPerson.motherId ?? "null");
      setIsOpen(true);
    } else if (availableIds.length > 0) {
      const maxId = Math.max(...availableIds);
      setValue('id', maxId + 1);
    } else {
      setValue('id', 1);
    }
  }, [selectedPerson, setValue, availableIds, setIsOpen]);

  useEffect(() => {
    if (person) {
      setValue('id', person.id); 
      setValue('name', person.name);
      setValue('gender', person.gender);
      setValue('partnerId', person.partnerId ?? "null");
      setValue('fatherId', person.fatherId ?? "null");
      setValue('motherId', person.motherId ?? "null");
      setIsOpen(true);
    }
  }, [person, setValue, setIsOpen]);


  const onSubmit = (data: any) => {
    console.log("Before updating persons:", persons); 
    const preparedData = {
      ...data,
      partnerId: data.partnerId === "null" ? null : data.partnerId.toString(),
      fatherId: data.fatherId === "null" ? null : data.fatherId.toString(),
      motherId: data.motherId === "null" ? null : data.motherId.toString(),
    };

    if (person) {
      onEditPerson(preparedData);
    } else {
      onPersonAdded(preparedData);
    }

    reset();
    setIsOpen(false);

    const updatedPersons = preparedData.partnerId
    ? updatePartnerId(persons, preparedData.id, preparedData.partnerId)
    : persons;

    setPersons(updatedPersons);

    mutation.mutate(preparedData, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['personIds'] });
        onPersonAdded(data);
      
        const updatedPersons = persons.map((person) => 
          person.id === data.partnerId ? { ...person, partnerId: data.id } : person
        ).concat(data);
      
        setPersons(updatedPersons);

        reset();
        setIsOpen(false);
        setSelectedPerson(null);
      }
    });
    
  };

  const mutation = useMutation<PersonData, Error, PersonData>({
    mutationFn: createPerson,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['personIds'] });
      onPersonAdded(data);
      
      const updatedPersons = [...persons, data];
      setPersons(updatedPersons);
      reset();

      setTimeout(() => {
        window.location.reload();
      }, 0);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  return (
    <div>
            <FormTitle>{person ? 'Edit Person' : 'New Person'}</FormTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label>Name:</Label>
                <Input {...register('name', { required: true })} />
                {errors.name && <ErrorMessage>This field is required</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <Label>ID:</Label>
                <Input {...register('id')} readOnly />
              </FormGroup>

              <FormGroup>
                <Label>Gender:</Label>
                <Select {...register('gender', { required: true })}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
                {errors.gender && <ErrorMessage>This field is required</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Partner ID:</Label>
                <Select {...register('partnerId')}>
                  <option value="null">None</option>
                  {availableIds.map((id: number) => (
                    <option key={id} value={id}>{id}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Father ID:</Label>
                <Select {...register('fatherId')}>
                  <option value="null">None</option>
                  {availableIds.map((id: number) => (
                    <option key={id} value={id}>{id}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Mother ID:</Label>
                <Select {...register('motherId')}>
                  <option value="null">None</option>
                  {availableIds.map((id: number) => (
                    <option key={id} value={id}>{id}</option>
                  ))}
                </Select>
              </FormGroup>

              <Actions>
                <CancelButton type="button" onClick={() => setIsOpen(false)}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit">
                  Save
                </SubmitButton>
              </Actions>
            </form>   
    </div>
  );
};

export default NewPersonForm;
