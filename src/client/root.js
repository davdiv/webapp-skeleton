import { Link } from 'react-router';

export default class Root extends React.Component {
    render() {
        return <div>
                   <nav className="navbar navbar-default navbar-static-top">
                       <div className="container-fluid">
                           <div className="navbar-header">
                               <Link className="navbar-brand" to={ "/" }>Web app skeleton</Link>
                           </div>
                       </div>
                   </nav>
                   { this.props.children }
               </div>;
    }
}
