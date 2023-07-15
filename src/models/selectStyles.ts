export const selectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: '#DEE2E6',
    padding: '7px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '15px',
    color: 'white',
    transition: 'background-color 0.5s, box-shadow 0.5s',
    fontWeight: 'bold',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '8px 4px 20px 2px rgba(255, 255, 255, 0.2)',
    },
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: '#001233',
    color: '#979DAC',
    fontWeight: 'bold',
  }),
  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: '#495057',
    fontWeight: 'bold',
  }),
  menu: (provided: any, state: any) => ({
    ...provided,
    borderRadius: '5px',
  }),
};

export const selectStylesVenda = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: '#001233',
    padding: '7px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '15px',
    color: 'white',
    transition: 'background-color 0.5s, box-shadow 0.5s',
    fontWeight: 'bold',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '8px 4px 20px 2px rgba(255, 255, 255, 0.2)',
    },
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: '#001233',
    color: '#979DAC',
    fontWeight: '700',
  }),
  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: '#979DAC',
    fontWeight: 'bold',
  }),
  menu: (provided: any, state: any) => ({
    ...provided,
    borderRadius: '5px',
  }),
};
