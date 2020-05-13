import React from 'react';
import {Dropdown} from 'primereact/dropdown';

class DropdownInput extends React.Component{


  render(){
    const label = this.props.label+":";

    return (<tr>
    <td>
        <div className="p-col" style={{display:'inline', paddingRight:'2em'}}>
            {label}
        </div>
    </td>
    <td>
      <div className="p-col" style={{display:'inline', paddingRight:'2em', position: "relative", left:"125px"}}>
        <Dropdown optionLabel="label" optionValue="value"  value={this.props.value} options={this.props.options} onChange={this.props.onChange} placeholder={this.props.placeholder}/>
      </div>
    </td>
    </tr>);
  }
}
export default DropdownInput;
