import { PersonData } from './types';

export const transformToBalkanNodes = (persons: PersonData[]) => {
  const personMap = new Map<number, PersonData>();

  persons.forEach(person => {
    personMap.set(person.id, person);
  });

  return persons.map(person => {
    const partnerId = person.partnerId ? parseInt(person.partnerId as any, 10) : null;
    const fatherId = person.fatherId ? parseInt(person.fatherId as any, 10) : null;
    const motherId = person.motherId ? parseInt(person.motherId as any, 10) : null;


    const pids = partnerId ? [partnerId] : [];

    const transformedNode = {
      id: person.id,
      pids: pids,
      mid: motherId ?? null,
      fid: fatherId ?? null,
      name: person.name,
      gender: person.gender.toLowerCase(),
      img: person.img,
      template: person.template,
    };

    console.log('Transformed Node:', transformedNode);
    return transformedNode;
  });
};


export const updatePartnerId = (persons: PersonData[], personId: number, partnerId: number) => {
  return persons.map(person => {
    if (person.id === personId) {
      return { ...person, partnerId };
    }
    if (person.id === partnerId) {
      return { ...person, partnerId: personId };
    }
    return person;
  });
};
