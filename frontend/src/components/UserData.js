import React from 'react';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/rhea/theme.css';
import 'primeicons/primeicons.css';
//import './index.css';
//import App from './App';
import {Panel} from 'primereact/panel';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Dropdown} from 'primereact/dropdown';
import {Growl} from 'primereact/growl';
import {InputText} from 'primereact/inputtext';
import DateInput from './tableinputs/DateInput';
import DropdownInput from './tableinputs/DropdownInput';
import TextInput from './tableinputs/TextInput';
import {Button} from 'primereact/button';
import axios from 'axios';

class UserService {

  prepareData(str){
    return str.replace(/ /g, "+");
  }

    loadUsers(){
      // TODO: make GET-Request to REST API
      let data = axios.get("http://localhost:80/bibVerw/users.php?request=Select");

      return data;
    }

    editUsers(eventData){
      // TODO: make GET-Request to REST API
      let getString = "http://localhost:80/bibVerw/users.php?request=Edit";
      getString += "&uid="+eventData.id;
      getString += "&anrede="+eventData.anrede;
      getString += "&nname="+this.prepareData(eventData.nachname);
      getString += "&vname="+this.prepareData(eventData.vorname);
      getString += "&gebDatum="+eventData.gebDatum;

      console.log("Send to Server: "+getString);

      let data = axios.get(getString);

      return data;
    }

    addUsers(inputData){
      // TODO: make GET-Request to REST API
      let getString = "http://localhost:80/bibVerw/users.php?request=Insert";

      getString += "&anrede="+inputData.anrede;
      getString += "&nname="+inputData.nachname;
      getString += "&vname="+inputData.vorname;
      getString += "&gebDatum="+inputData.gebDatum;

      let data = axios.get(getString);

      //console.log(data);
      //data.records.forEach(d => console.log(d));

      return data;

      //[{anrede: "Herr", nname: "Jonas",vname: "Justus", gebDatum: "2020-01-01"}]
    }
}


class MyUserTab extends React.Component{

  constructor() {
       super();
       //this.growl = {};
       this.state = {
         error: null,
         isLoaded: false,
         genders: [
             {dataKey: 1, label: 'Hr', value: 'Herr'},
             {dataKey: 2, label: 'Fr.', value: 'Frau'},
             {dataKey: 3, label: 'Div.', value: 'Div'}
         ],
         anrede: "",
         nname: "",
         vname: "",
         gebDat: "",
         users: []
       };
       this.clonedUsers = {};
       this.userservice = new UserService();

       this.editorForRowEditing = this.editorForRowEditing.bind(this);
       this.onRowEditorValidator = this.onRowEditorValidator.bind(this);
       this.onRowEditInit = this.onRowEditInit.bind(this);
       this.onRowEditSave = this.onRowEditSave.bind(this);
       this.onRowEditCancel = this.onRowEditCancel.bind(this);
       this.onInsert = this.onInsert.bind(this);
   }

   componentDidMount() {
       this.userservice.loadUsers().then(
      result => {
        this.setState({
          isLoaded: true,
          users: result.data.records
        });
        //console.log(result.data);
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      error => {
        this.setState({
          isLoaded: true,
          error
        });
      }
      );
      //console.log(this.state.users);
      //this.state.users.forEach(u => console.log(u));
   }

   /* Row Editing */
   onEditorValueChangeForRowEditing(props, value) {
       let updatedUsers = [...props.value];

       updatedUsers[props.rowIndex][props.field] = value;
       this.setState({users: updatedUsers});
   }

   editorForRowEditing(props, field) {
     if(field === 'anrede'){
       return <Dropdown optionLabel="label" optionValue="value"  value={props.rowData[field]} options={this.state.genders} onChange={(e) => this.onEditorValueChangeForRowEditing(props, e.target.value)} placeholder="m/f/d"/>;
     }else{
       return <InputText type="text" value={props.rowData[field]} onChange={(e) => this.onEditorValueChangeForRowEditing(props, e.target.value)} />;
     }
   }

   onRowEditorValidator(rowData) {
       let value = rowData['nachname'];
       return value.length > 0;
   }

   onRowEditInit(event) {
       this.clonedUsers[event.data.id] = {...event.data};
   }

   onRowEditSave(event) {
       if (this.onRowEditorValidator(event.data)) {
           delete this.clonedUsers[event.data.id];
           this.userservice.editUsers(event.data);
           this.growl.show({severity: 'success', summary: 'Success', detail: 'User is updated'});
       }
       else {
           this.growl.show({severity: 'error', summary: 'Error', detail: 'Field Nachname is required'});
       }
   }

   onRowEditCancel(event) {
       let myUsers = [...this.state.users];
       myUsers[event.index] = this.clonedUsers[event.data.id];
       delete this.clonedUsers[event.data.id];
       this.setState({
           users: myUsers
       });
   }

   onInsert(event){
     this.userservice.addUsers({
         anrede:this.state.anrede,
         nachname:this.state.nname,
         vorname:this.state.vname,
         gebDatum:this.state.gebDat
       });
     this.growl.show(
       {severity: 'success', summary: 'Success', detail: 'Added user '+this.state.vname+" "+this.state.nname}
     );
   }
// style={{layout: "grid", gridTemplateColumns: "1fr 1fr"}}>
   render() {
       return (
         <div className="content-section implementation">
           <Growl ref={(el) => this.growl=el}/>
           <Panel header="Insert" style={{marginTop:'2em', marginBottom:'2em'}} toggleable={true}>
             <div className="p-grid nested-grid" style={{width: "500px"}}>
             <div className="p-col-8" style={{position: "static"}}>
             <table>
                <tbody>
                  <DropdownInput label="Anrede" optionLabel="label" optionValue="value"  value={this.state.anrede} options={this.state.genders} onChange={(e) => {this.setState({anrede: e.value})}} placeholder="m/f/d"/>
                  <TextInput label="Nachname" value={this.state.nname} onChange={(e) => this.setState({nname: e.target.value})}/>
                  <TextInput label="Vorname" value={this.state.vname} onChange={(e) => this.setState({vname: e.target.value})}/>
                  <DateInput label='Geburtsdatum' value={this.state.gebDat} onChange={(e) => this.setState({gebDat: e.value})}/>
                </tbody>
              </table>
            </div>

              <div className="p-col-4" style={{textAlign: "right"}}>
              <Button label="Insert" onClick={this.onInsert} />
              </div>
          </div>
          </Panel>
           <DataTable value={this.state.users} editMode="row" rowEditorValidator={this.onRowEditorValidator} onRowEditInit={this.onRowEditInit} onRowEditSave={this.onRowEditSave} onRowEditCancel={this.onRowEditCancel}>
               <Column field="id" header="ID" style={{height: '3.5em'}}/>
               <Column field="anrede" header="Anrede" editor={(props) => this.editorForRowEditing(props, 'anrede')} style={{height: '3.5em'}}/>
               <Column field="nachname" header="Nachname" editor={(props) => this.editorForRowEditing(props, 'nachname')} style={{height: '3.5em'}}/>
               <Column field="vorname" header="Vorname" editor={(props) => this.editorForRowEditing(props, 'vorname')} style={{height: '3.5em'}}/>
               <Column field="gebDatum" header="Geburtsdatum" editor={(props) => this.editorForRowEditing(props, 'gebDatum')} style={{height: '3.5em'}}/>
               <Column rowEditor={true} style={{'width': '70px', 'textAlign': 'center'}}/>
           </DataTable>
         </div>
       );
   }
}
export default MyUserTab;
