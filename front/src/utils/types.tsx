export interface PersonData {
  id: number;
  name: string;
  gender: Gender;
  template: string;
  img: string;
  partnerId?: number | null;
  fatherId?: number | null; 
  motherId?: number| null;  
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

export interface TreeProps {
  persons: PersonData[];
  onEditPerson?: (id: number) => void;
  onDeletePerson?: (id: number) => void;
  setSelectedPerson: (person: PersonData | null) => void;
  setIsOpen: (isOpen: boolean) => void;
}
