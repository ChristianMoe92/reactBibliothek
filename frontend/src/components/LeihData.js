import React from 'react';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/rhea/theme.css';
import 'primeicons/primeicons.css';
//import './index.css';
//import App from './App';
import {Panel} from 'primereact/panel';
import {Growl} from 'primereact/growl';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Button} from 'primereact/button';
import {ContextMenu} from 'primereact/contextmenu';
import DropdownInput from './tableinputs/DropdownInput';
import axios from 'axios';

class LeihService {

  unlendBooks(removeEventData){

    let restString = "http://localhost:80/bibVerw/books.php?request=Lend"

    restString += "&newUser=0";//+data.newU;
    restString += "&choBook="+removeEventData.bid;


console.log(restString);
    let data = axios.get(restString);


    //data.records.forEach(d => console.log(d));

    return data;

    //[{anrede: "Herr", nname: "Jonas",vname: "Justus", gebDatum: "2020-01-01"}]
  }

    lendBooks(addEventData){

      let restString = "http://localhost:80/bibVerw/books.php?request=Lend"

      restString += "&newUser="+addEventData.newU;
      restString += "&choBook="+addEventData.bid;

      let data = axios.get(restString);

      //console.log(data);
      //data.records.forEach(d => console.log(d));

      return data;

      //[{anrede: "Herr", nname: "Jonas",vname: "Justus", gebDatum: "2020-01-01"}]
    }

    loadBooks(){
      // TODO: make GET-Request to REST API
      let data = axios.get("http://localhost:80/bibVerw/books.php?request=Select&onlyLend=TRUE");

      //console.log(data);
      //data.records.forEach(d => console.log(d));

      return data;

      //[{anrede: "Herr", nname: "Jonas",vname: "Justus", gebDatum: "2020-01-01"}]
    }

    loadBookNums(){
      // TODO: make GET-Request to REST API
      let data = axios.get("http://localhost:80/bibVerw/books.php?request=Select&onlyIDs=TRUE");

      //console.log(data);
      //let myList = [];
      //data.records.forEach(d => this.makeDropDownList(myList, d));

      return data;

      //[{anrede: "Herr", nname: "Jonas",vname: "Justus", gebDatum: "2020-01-01"}]
    }

    loadUserNums(){
      // TODO: make GET-Request to REST API
      let data = axios.get("http://localhost:80/bibVerw/users.php?request=Select&onlyIDs=TRUE");

      //console.log(data);
      //let myList = [];
      //data.records.forEach(d => this.makeDropDownList(myList, d));

      return data;

      //[{anrede: "Herr", nname: "Jonas",vname: "Justus", gebDatum: "2020-01-01"}]
    }
}


class MyLeihData extends React.Component{

  constructor() {
       super();

       this.state = {
         error: null,
         isLoaded: false,
         currBook: null,
        menu: [
            {label: 'View', icon: 'pi pi-fw pi-search', command: (event) => this.viewBook(this.state.currBook)},
            {label: 'Give back', icon: 'pi pi-fw pi-times', command: (event) => this.unBorrowBook(this.state.currBook)}
        ],
        books: [],
        bookNums: [],
        userNums: [],
        nutzerId: 0,
        buchId: 0
       };
       this.bookservice = new LeihService();

       this.onBorrowBook = this.onBorrowBook.bind(this);
       this.viewBook = this.viewBook.bind(this);
       this.unBorrowBook = this.unBorrowBook.bind(this);
   }

   componentDidMount() {
     this.bookservice.loadBookNums().then(
    resultBN => {
      this.setState({
        isLoaded: true,
        bookNums: this.prepareDropdownEntries(resultBN.data.records)

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
    });

    this.bookservice.loadUserNums().then(
   resultUN => {
     this.setState({
       isLoaded: true,
       userNums: this.prepareDropdownEntries(resultUN.data.records)

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
   });

   this.bookservice.loadBooks().then(
      resultB => {
        this.setState({
          isLoaded: true,
          books: resultB.data.records

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
      });

      //console.log(this.state.users);
      //this.state.books.forEach(u => console.log(u));
   }

   makeDropDownList(targetArray, dataEntry){
     targetArray.push({label:""+dataEntry.id, value: dataEntry.id});//Morpheus fragen fml
   }

   prepareDropdownEntries(listOld){
     let myList = [];
     listOld.forEach(d => this.makeDropDownList(myList, d));

     return myList;
   }

   onBorrowBook(event){
     console.log("Gewählt: "+this.state.nutzerId);
     let eveDat = {newU: this.state.nutzerId, bid: this.state.buchId};
     this.bookservice.lendBooks(eveDat);
   }

   viewBook(selBook){
     console.log(this.state.currBook.titel);
     //TODO: Ausgabe in modal
   }

   unBorrowBook(selBook){
     console.log(selBook.titel);
     this.bookservice.unlendBooks({bid: selBook.id});
   }

   render() {
       return (
         <div className="content-section implementation">
           <Growl ref={(el) => this.growl=el}/>
           <Panel header="Ausleihe" style={{marginTop:'2em', marginBottom:'2em'}} toggleable={true}>
             <div className="p-grid nested-grid" style={{width: "500px"}}>
             <table>
              <tbody>
                <DropdownInput label="Nutzer"  value={this.state.nutzerId} options={this.state.userNums} onChange={(e) => {this.setState({nutzerId: e.value})}} placeholder="Nutzer"/>
                <DropdownInput label="Buch"  value={this.state.buchId} options={this.state.bookNums} onChange={(e) => {this.setState({buchId: e.value})}} placeholder="Buch"/>
              </tbody>
             </table>
             </div>
             <div className="p-col-4" style={{textAlign: "right"}}>
             <Button label="Borrow a Book" onClick={this.onBorrowBook} />
             </div>
           </Panel>
           <ContextMenu model={this.state.menu} ref={el => this.cm = el} onHide={() => this.setState({currBook: null})}/>

             <DataTable value={this.state.books} contextMenuSelection={this.state.currBook} onContextMenuSelectionChange={e => this.setState({currBook: e.value})}
                        onContextMenu={e => this.cm.show(e.originalEvent)}>
                <Column field="id" header="ID" />
                <Column field="autor" header="Autor" />
                <Column field="titel" header="Titel" />
                 <Column field="verlag" header="Verlag" />
                 <Column field="erschDatum" header="Erscheinungsdatum" />
                 <Column field="ausgelAn" header="Ausgeliehen an" />

             </DataTable>
           </div>
       );
   }
}
export default MyLeihData;
