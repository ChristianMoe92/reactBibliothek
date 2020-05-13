import React from 'react';
import {InputText} from 'primereact/inputtext';

class TextInput extends React.Component{

  render(){
    const label = this.props.label+":";

    return (<tr>
      <td>
      <div className="p-col" style={{display:'inline', paddingRight:'2em'}}>
          {label}
      </div>
      </td>
      <td>
      <div className="p-col" style={{display:'inline', paddingRight:'2em'}}>
        <span className="p-float-label" style={{display:'inline', position: "relative", left:"125px"}}>
              <InputText id="in" value={this.props.value} onChange={this.props.onChange} />
              <label htmlFor="in">{this.props.label}</label>
        </span>
      </div>

      </td>
      </tr>);
  }
}
export default TextInput;
