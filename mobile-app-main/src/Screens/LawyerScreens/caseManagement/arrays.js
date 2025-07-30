export const party  = [
    { label: 'Applicant', value: 'applicant' },
    { label: 'Defendant', value: 'defendant' },
    { label: 'Petitioner', value: 'petitioner' },
    { label: 'Plaintif', value: 'plaintif' },
    { label: 'Appellant', value: 'appellant' },
    { label: 'Respondent', value: 'respondent' },
    { label: 'Accused', value: 'accused' },
  ];
  export const status  = [
    { label: 'Open', value: 'open' },
    { label: 'In progress', value: 'in progress' },
    { label: 'Active', value: 'active' },
  ];
  export const years = Array.from({ length: 2050 - 1990 + 1 }, (_, i) => {
    const year = (1990 + i).toString();
    return { label: year, value: year };
  });
  export const decisionType  = [
    { label: 'type 1', value: 'type 1' },
    { label: 'type 2', value: 'type 2' },
    { label: 'type 3', value: 'type 3' },
  ];