
import HeaderComponent from './../HeaderComponent/HeaderComponent';
import FooterComponent from '../FooterComponent/FooterComponent';
import { WrapperDefault } from './style';

const DefaultComponent = ({children}) => {
  return (
    <WrapperDefault>
      <HeaderComponent/>
      {children}
      <FooterComponent/>

    </WrapperDefault>
  )
}

export default DefaultComponent