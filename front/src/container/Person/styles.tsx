import styled from 'styled-components';

export const FormContainer = styled.div`
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
`;

export const FormTitle = styled.h2`
  margin-bottom: 20px;
  color: #333;
  font-size: 18px;
  font-weight: 500;
`;

export const FormGroup = styled.div`
  margin-bottom: 15px;
  display: flex;
  justify-content: space-betwen;
  align-items: center;
`;

export const Label = styled.label`
  flex: 1;
  font-size: 14px;
  color: #555;
`;

export const Input = styled.input`
  padding: 8px;
  flex: 2;
  margin-left: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export const Select = styled.select`
  flex: 2;
  padding: 8px;
  margin-left: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;


export const ErrorMessage = styled.span`
  color: red;
  font-size: 12px;
  display: block;
  margin-top: 5px;
`;

export const SubmitButton = styled.button`
  padding: 10px;
  background-color: #3f51b5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px
`;

export const CancelButton = styled.button`
  padding: 10px;
  background-color: transparent;
  color: #3f51b5;
  border: none;
  cursor: pointer;
  font-size: 14px;
  margin-rigth: 10px;
`;
