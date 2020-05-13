import React from 'react';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/rhea/theme.css';
import 'primeicons/primeicons.css';
//import './index.css';
//import App from './App';
import {Panel} from 'primereact/panel';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Growl} from 'primereact/growl';
import {InputText} from 'primereact/inputtext';
//import {InputMask} from 'primereact/inputmask';
import {Button} from 'primereact/button';
import DateInput from './tableinputs/DateInput';
import FloatInput from './tableinputs/FloatInput';
import TextInput from './tableinputs/TextInput';
import axios from 'axios';

class BookService {

prepareData(str){
  return str.replace(/ /g, "+");
}

    loadBooks(){
      // TODO: make GET-Request to REST API
      let data = axios.get("http://localhost:80/bibVerw/books.php?request=Select");

      //console.log(data);
      //data.records.forEach(d => console.log(d));

      return data;

      //[{anrede: "Herr", nname: "Jonas",vname: "Justus", gebDatum: "2020-01-01"}]
    }

/*
TODO: Handle Spaces in Titel and author
*/
    editBooks(eventData){
      // TODO: make GET-Request to REST API
      let getString = "http://localhost:80/bibVerw/books.php?request=Edit";
      getString += "&bid="+eventData.id;
      getString += "&titel="+this.prepareData(eventData.titel);
      getString += "&autor="+this.prepareData(eventData.autor);
      getString += "&verl="+this.prepareData(eventData.verlag);
      getString += "&erschDatum="+eventData.erschDatum;
      getString += "&origPr="+eventData.origPreis;
      getString += "&waehr="+eventData.waehrung;


      console.log("Send to Server: "+getString);

      let data = axios.get(getString);

      return data;
    }

    addBooks(inputData){
      // TODO: make GET-Request to REST API
      let getString = "http://localhost:80/bibVerw/books.php?request=Insert";

      getString += "&titel="+inputData.titel;
      getString += "&autor="+inputData.autor;
      getString += "&verl="+inputData.verlag;
      getString += "&erschDatum="+inputData.erschDatum;
      getString += "&origPr="+inputData.origPr;
      getString += "&waehr="+inputData.waehr;

      let data = axios.get(getString);


      return data;

    }
}


class MyBookData extends React.Component{

  constructor() {
       super();
       this.state = {
         error: null,
         isLoaded: false,
         autor: "",
         titel:"",
         verlag:"",
         erschDat: "",
         origPreis:"",
         waehrung:"",
         books: []
       };
       this.clonedBooks = {};
       this.bookservice = new BookService();

       this.editorForRowEditing = this.editorForRowEditing.bind(this);
       this.onRowEditorValidator = this.onRowEditorValidator.bind(this);
       this.onRowEditInit = this.onRowEditInit.bind(this);
       this.onRowEditSave = this.onRowEditSave.bind(this);
       this.onRowEditCancel = this.onRowEditCancel.bind(this);
       this.onInsert = this.onInsert.bind(this);
   }

   componentDidMount() {
       this.bookservice.loadBooks().then(
      result => {
        this.setState({
          isLoaded: true,
          books: result.data.records
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
      //console.log(this.state.books);
      this.state.books.forEach(u => this.prepareData(u));
   }

   prepareData(u){
     if(u.ausgeliehen_an>0){u.istAusgel="Vergeben"}else{u.istAusgel="Verfügbar"}
   }
   /* Row Editing */
   onEditorValueChangeForRowEditing(props, value) {
       let updatedBooks = [...props.value];

       updatedBooks[props.rowIndex][props.field] = value;
       this.setState({books: updatedBooks});
   }

   editorForRowEditing(props, field) {
       return <InputText type="text" value={props.rowData[field]} onChange={(e) => this.onEditorValueChangeForRowEditing(props, e.target.value)} />;
   }

   onRowEditorValidator(rowData) {
       let value = rowData['titel'];
       return value.length > 0;
   }

   onRowEditInit(event) {
       this.clonedBooks[event.data.id] = {...event.data};
   }

   onRowEditSave(event) {
       if (this.onRowEditorValidator(event.data)) {
           delete this.clonedBooks[event.data.id];
           this.bookservice.editBooks(event.data);
           this.growl.show({severity: 'success', summary: 'Success', detail: 'Book is updated'});
       }
       else {
           this.growl.show({severity: 'error', summary: 'Error', detail: 'Field Titel und Autor sind nötig'});
       }
   }

   onRowEditCancel(event) {
       let myBooks = [...this.state.books];
       myBooks[event.index] = this.clonedBooks[event.data.id];
       delete this.clonedBooks[event.data.id];
       this.setState({
           books: myBooks
       });
   }

   onInsert(event){
     this.bookservice.addBooks({
         autor:this.state.autor,
         titel:this.state.titel,
         verlag:this.state.verlag,
         erschDatum:this.state.erschDat,
         origPr:this.state.origPreis,
         waehr:this.state.waehrung
       });
     this.growl.show(
       {severity: 'success', summary: 'Success', detail: 'Added book '+this.state.titel+" von "+this.state.titel}
     );
   }
   render() {
       return (
<div className="content-section implementation">
         <Growl ref={(el) => this.growl=el}/>
         <Panel header="Insert" style={{marginTop:'2em', marginBottom:'2em'}} toggleable={true}>
           <div className="p-grid nested-grid" style={{width: "500px"}}>
           <div className="p-col-8" style={{position: "static"}}>
           <table>

           <tbody>
             <TextInput label="Autor" value={this.state.autor} onChange={(e) => this.setState({autor: e.target.value})}/>
             <TextInput label="Titel" value={this.state.titel} onChange={(e) => this.setState({titel: e.target.value})} />
             <TextInput label="Verlag" value={this.state.verlag} onChange={(e) => this.setState({verlag: e.target.value})}/>
             <DateInput label="Erscheinungsdatum" value={this.state.erschDat} onChange={(e) => this.setState({erschDat: e.value})}/>
             <FloatInput label="Originalpreis" value={this.state.origPreis} onChange={(e) => this.setState({origPreis: e.value})}/>
             <TextInput label="Waehrung" value={this.state.waehrung} onChange={(e) => this.setState({waehrung: e.target.value})}/>
            </tbody>
            </table>

        </div>
            <div className="p-col-4" style={{textAlign: "right"}}>
            <Button label="Insert" onClick={this.onInsert} />
            </div>
        </div>
        </Panel>
           <DataTable value={this.state.books} editMode="row" rowEditorValidator={this.onRowEditorValidator} onRowEditInit={this.onRowEditInit} onRowEditSave={this.onRowEditSave} onRowEditCancel={this.onRowEditCancel}>
               <Column field="id" header="ID" style={{height: '3.5em'}}/>
               <Column field="autor" header="Autor" editor={(props) => this.editorForRowEditing(props, 'autor')} style={{height: '3.5em'}}/>
               <Column field="titel" header="Titel" editor={(props) => this.editorForRowEditing(props, 'titel')} style={{height: '3.5em'}}/>
               <Column field="verlag" header="Verlag" editor={(props) => this.editorForRowEditing(props, 'verlag')} style={{height: '3.5em'}}/>
               <Column field="erschDatum" header="Erscheinungsdatum" editor={(props) => this.editorForRowEditing(props, 'erschDatum')} style={{height: '3.5em'}}/>
               <Column field="origPreis" header="Originalpreis" editor={(props) => this.editorForRowEditing(props, 'origPreis')} style={{height: '3.5em'}}/>
               <Column field="waehrung" header="Währung" editor={(props) => this.editorForRowEditing(props, 'waehrung')} style={{height: '3.5em'}}/>
               <Column field="status" header="Status"/>
               <Column rowEditor={true} style={{'width': '70px', 'textAlign': 'center'}}/>
           </DataTable>
         </div>
       );
   }
}
export default MyBookData;
