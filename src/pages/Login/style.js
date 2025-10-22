import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f4f6ff;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const LeftSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;

  @media (max-width: 900px) {
    flex: none;
    height: 60%;
  }
`;

export const RightSection = styled.div`
  flex: 1;
  background-color: #000dff;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 900px) {
    flex: none;
    height: 40%;
  }
`;

export const ImageSide = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const LoginBox = styled.div`
  width: 80%;
  max-width: 400px;
  text-align: center;
`;

export const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #000dff;
  margin-bottom: 25px;
`;

export const InputField = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: 0.3s;

  &:focus {
    border-color: #000dff;
    box-shadow: 0 0 5px rgba(0, 13, 255, 0.3);
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #000dff;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #6b73ff;
  }
`;

export const TextLink = styled.p`
  margin-top: 15px;
  font-size: 14px;

  a {
    color: #000dff;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ErrorText = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
`;
