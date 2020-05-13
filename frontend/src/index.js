import React from 'react';
import ReactDOM from 'react-dom';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/rhea/theme.css';
import 'primeicons/primeicons.css';
//import './index.css';
import App from './App';
//import UserTable from './components/UserData';
//import {TabView,TabPanel} from 'primereact/tabview';
import * as serviceWorker from './serviceWorker';

/*class MyTab extends React.Component{

  constructor(props){
      super(props);
      this.state = {activeIndex: 0};
    }

  render(){
    return(
      <div>
    <TabView activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({activeIndex: e.index})}>
      <TabPanel header="Benutzer" leftIcon="pi pi-fw pi-user">
          <UserTable/>
      </TabPanel>
      <TabPanel header="Bücher" leftIcon="pi pi-bookmark">
          <div className="bookContent"/>
      </TabPanel>
      <TabPanel header="Aktuelle Ausleihen" leftIcon="pi pi-eject">
          <div className="leihContent"/>
      </TabPanel>
    </TabView>
  </div>);
  }

}*/

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
