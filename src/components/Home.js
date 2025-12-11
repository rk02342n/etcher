import './styles.scss';
import Paddington from '../Images/paddington.png'
import { Link } from 'react-router-dom';
import ContractPlayground from './ContractPlayground';
import RegistryContractForm from './RegistryContractForm';

const Home = () => {
    return(
    <>
        <div className="text-center">
            {/* <h2 style={{ fontFamily: 'Palatino, URW Palladio L, serif', fontSize: '26px' }}>Etcher</h2> */}
            <h1 className="mt-3" style={{ fontFamily: 'Palatino, URW Palladio L, serif', fontSize: '26px' }}>Etcher</h1>
            <h2 style={{ fontFamily: 'Palatino, URW Palladio L, serif', fontSize: '20px' }}>Verifiable publishing for the open web</h2>
            <hr />
            <Link to="/allposts"> <img src={Paddington} alt="paddington bear" height="500"></img></Link>
            {/* <ContractPlayground /> */}
            {/* <RegistryContractForm /> */}
        </div>
    </>
    );
}

export default Home;
