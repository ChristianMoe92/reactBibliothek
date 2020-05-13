import React from 'react';
import {InputMask} from 'primereact/inputmask';

class DateInput extends React.Component{

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
          <InputMask mask="9999-99-99" value={this.props.value} slotChar="yyyy-mm-dd" onChange={this.props.onChange}></InputMask>
        </div>
    </td>
    </tr>);
  }
}
export default DateInput;
