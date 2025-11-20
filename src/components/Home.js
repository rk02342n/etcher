import './styles.scss';
import Paddington from '../Images/paddington.png'
import { Link } from 'react-router-dom';

const Home = () => {
    return(
    <>
        <div className="text-center">
            <h2 style={{ fontFamily: 'Palatino, URW Palladio L, serif', fontSize: '26px' }}>Etch your ideas on Ether</h2>
            <hr />
            <Link to="/allposts"> <img src={Paddington} alt="paddington bear" height="500"></img></Link>
        </div>
    </>
    );
}

export default Home;
