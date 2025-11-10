import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const LeftSection = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
      radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
    background-size: 50px 50px, 80px 80px;
    opacity: 0.6;
  }

  @media (max-width: 900px) {
    flex: none;
    height: 40vh;
    min-height: 300px;
  }
`;

export const Moon = styled.div`
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle at 30% 30%, #fffef7, #f5f5dc);
  border-radius: 50%;
  box-shadow: 
    inset -20px -20px 0 0 rgba(0, 0, 0, 0.1),
    0 0 40px rgba(255, 255, 255, 0.3);
  z-index: 2;

  &::after {
    content: "";
    position: absolute;
    top: 20%;
    left: 30%;
    width: 30px;
    height: 30px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
  }

  &::before {
    content: "";
    position: absolute;
    top: 40%;
    right: 25%;
    width: 20px;
    height: 20px;
    background: rgba(0, 0, 0, 0.08);
    border-radius: 50%;
  }

  @media (max-width: 900px) {
    width: 120px;
    height: 120px;
    top: 10%;
  }
`;

export const TreeBranch = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 40px;
  background: #1a1a1a;
  z-index: 3;

  &::before {
    content: "";
    position: absolute;
    top: -10px;
    left: -15px;
    width: 30px;
    height: 2px;
    background: #1a1a1a;
    transform: rotate(-20deg);
  }

  &::after {
    content: "";
    position: absolute;
    top: -5px;
    right: -15px;
    width: 30px;
    height: 2px;
    background: #1a1a1a;
    transform: rotate(20deg);
  }
`;

export const Bird = styled.div`
  position: absolute;
  top: ${props => props.top || '18%'};
  left: ${props => props.left || '48%'};
  width: 12px;
  height: 8px;
  background: #1a1a1a;
  border-radius: 50% 0 50% 50%;
  transform: rotate(${props => props.rotate || '0deg'});
  z-index: 4;
`;

export const Hills = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(to top, #2c3e50 0%, #34495e 100%);
  clip-path: polygon(0% 100%, 0% 60%, 20% 50%, 40% 55%, 60% 45%, 80% 50%, 100% 55%, 100% 100%);
  z-index: 1;
`;

export const Trees = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  z-index: 2;

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 15%;
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-bottom: 60px solid #1a1a1a;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    right: 20%;
    width: 0;
    height: 0;
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
    border-bottom: 80px solid #1a1a1a;
  }
`;

export const WelcomeContent = styled.div`
  position: relative;
  z-index: 5;
  text-align: center;
  color: white;
  margin-top: auto;
  margin-bottom: 60px;
`;

export const WelcomeTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 900px) {
    font-size: 32px;
  }
`;

export const WelcomeText = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto 30px;
`;

export const SocialSection = styled.div`
  position: relative;
  z-index: 5;
  margin-top: auto;
  margin-bottom: 40px;
`;

export const SocialTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  letter-spacing: 2px;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.3);
    margin: 0 15px;
  }
`;

export const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

export const SocialIcon = styled.a`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bg || '#1da1f2'};
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

export const RightSection = styled.div`
  flex: 1;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  position: relative;

  @media (max-width: 900px) {
    flex: none;
    height: 60vh;
  }
`;

export const FormContainer = styled.div`
  width: 100%;
  max-width: 450px;
`;

export const TabContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 30px;
`;

export const Tab = styled.button`
  background: none;
  border: none;
  padding: 8px 16px;
  font-size: 16px;
  color: ${props => props.active ? '#1890ff' : '#666'};
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : '400'};
  border-bottom: ${props => props.active ? '2px solid #1890ff' : '2px solid transparent'};
  transition: all 0.3s;

  &:hover {
    color: #1890ff;
  }
`;

export const FormTitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  color: #000;
  margin-bottom: 30px;
`;

export const Form = styled.form`
  width: 100%;
`;

export const FormGroup = styled.div`
  margin-bottom: 25px;
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 0;
  border: none;
  border-bottom: 2px solid #e0e0e0;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
  background: transparent;

  &::placeholder {
    color: #999;
  }

  &:focus {
    border-bottom-color: #1890ff;
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 30px;
  gap: 10px;
`;

export const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  margin-top: 2px;
  cursor: pointer;
  accent-color: #1890ff;
`;

export const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #666;
  cursor: pointer;
  line-height: 1.5;

  a {
    color: #1890ff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;

  &:hover:not(:disabled) {
    background: #40a9ff;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ErrorText = styled.div`
  color: #ff4d4f;
  font-size: 14px;
  margin-bottom: 15px;
  padding: 10px;
  background: #fff1f0;
  border-radius: 4px;
  border-left: 3px solid #ff4d4f;
`;

export const SuccessText = styled.div`
  color: #52c41a;
  font-size: 14px;
  margin-bottom: 15px;
  padding: 10px;
  background: #f6ffed;
  border-radius: 4px;
  border-left: 3px solid #52c41a;
`;

export const LinkText = styled.p`
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;

  a {
    color: #1890ff;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const PasswordRequirements = styled.div`
  margin-top: 8px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
`;

export const RequirementItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  color: ${props => props.valid ? '#52c41a' : '#999'};

  &:last-child {
    margin-bottom: 0;
  }

  &::before {
    content: "${props => props.valid ? '✓' : '○'}";
    font-size: 14px;
    font-weight: bold;
    color: ${props => props.valid ? '#52c41a' : '#999'};
  }
`;

