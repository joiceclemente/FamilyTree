import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient, MutationFunction } from '@tanstack/react-query';
import NewPersonForm from './container/Person';
import { PersonData } from './utils/types';
import MyTree from './container/Tree';
import { Box, Button, Modal } from '@mui/material';

const deletePerson: MutationFunction<void, number> = async (id: number) => {
  const response = await fetch(`http://localhost:3001/api/person/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete person');
  }
};

const updatePerson: MutationFunction<PersonData, PersonData> = async (personData: PersonData) => {
  const response = await fetch(`http://localhost:3001/api/person/${personData.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(personData),
  });

  if (!response.ok) {
    throw new Error('Failed to update person');
  }

  return response.json();
};

const fetchPersons = async (): Promise<PersonData[]> => {
  const response = await fetch('http://localhost:3001/api/person/ids');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  
  console.log('Data from API:', data);
  
  return data;
};


const App: React.FC = () => {
  const [persons, setPersons] = useState<PersonData[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<PersonData | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

const { data } = useQuery<PersonData[], Error>({
  queryKey: ['personsIds'],
  queryFn: fetchPersons,
});

useEffect(() => {
  if (data && data.length > 0) {
    setPersons(data);
  }
}, [data]);

useEffect(() => {
  if (persons.length > 0) {
    console.log("Persons updated:", persons);
  }
}, [persons]);

const mutation = useMutation<PersonData, Error, PersonData>({
  mutationFn: updatePerson,
  onSuccess: (updatedPerson: PersonData) => {
    const updatedPersons = persons.map((person: PersonData) =>
      person.id === updatedPerson.id ? updatedPerson : person
    );
    setPersons(updatedPersons);
    queryClient.invalidateQueries({ queryKey: ['personsIds'] });
    setIsOpen(false);
    setSelectedPerson(null);
  },
});

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: deletePerson,
    onSuccess: (_, id) => {
      setPersons((prevPersons) => prevPersons.filter((person) => person.id !== id));
      queryClient.invalidateQueries({ queryKey: ['personsIds'] });
    },
  });

  
  const handlePersonAdded = (newPerson: PersonData) => {
    setPersons(prevPersons => {
      const existingIndex = prevPersons.findIndex(p => p.id === newPerson.id);
      if (existingIndex >= 0) {
        const updatedPersons = [...prevPersons];
        updatedPersons[existingIndex] = newPerson;
        return updatedPersons;
      }
      return [...prevPersons, newPerson];
    });
  };
  
  const handleEditPerson = (id: number) => {
    const personToEdit = persons.find(p => p.id === id);
  
    if (personToEdit) {
      setSelectedPerson(personToEdit);
      setIsOpen(true);
    } 
  };
  
  const handleDeletePerson = (id: number) => {
    deleteMutation.mutate(id);
  };

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  

  return (
    <div>
         <Button  onClick={() => setIsOpen(true)}
              sx={{ backgroundColor: '#3f51b5', 
                color: 'white',            
                padding: '10px',
                margin: '20px',                     
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                '&:hover': {
                    backgroundColor: '#45A049',
                  },
              }}
        >

          New Person

        </Button>

        <Modal
            open={isOpen}
            onClose={() => setIsOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
          <Box sx={style}>
            <NewPersonForm 
              onPersonAdded={handlePersonAdded} 
              selectedPerson={selectedPerson} 
              setSelectedPerson={setSelectedPerson} 
              onEditPerson={mutation.mutate}
              onDeletePerson={handleDeletePerson}
              persons={persons}
              setPersons={setPersons}
              setIsOpen={setIsOpen}
              availableIds={persons.map((p) => p.id)} 
              person={selectedPerson || undefined}
            />
          </Box>
        </Modal>
    
       <MyTree 
            key={JSON.stringify(persons)}
             persons={persons}
             onEditPerson={handleEditPerson}
             onDeletePerson={handleDeletePerson}
             setSelectedPerson={setSelectedPerson}
             setIsOpen={setIsOpen}
            />
    </div>
  );
};

export default App;