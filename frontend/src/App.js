import React from 'react';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/rhea/theme.css';
import 'primeicons/primeicons.css';
import UserTable from './components/UserData';
import BookTable from './components/BookData';
import LeihTable from './components/LeihData';
import {TabView,TabPanel} from 'primereact/tabview';

class App extends React.Component{

  constructor(props){
      super(props);
      this.state = {activeIndex: 0, myDate:''};
    }

  render(){
    return(
      <div>
        <h1> Leih-Prärie </h1>
    <TabView activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({activeIndex: e.index})}>
      <TabPanel header="Benutzer" leftIcon="pi pi-fw pi-user">
          <UserTable/>
      </TabPanel>
      <TabPanel header="Bücher" leftIcon="pi pi-bookmark">
          <BookTable/>
      </TabPanel>
      <TabPanel header="Aktuelle Ausleihen" leftIcon="pi pi-eject">
          <LeihTable/>
      </TabPanel>
    </TabView>
  </div>);
  }

}

export default App;
