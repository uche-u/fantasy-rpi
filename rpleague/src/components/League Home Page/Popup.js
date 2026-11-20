import React from 'react';
const Popup = ({ handleClose, show, code }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";
  
    return (
      <div className={showHideClassName}>
        <section className="modal-main">
          <p>Send your friends the following invite code: {code}</p>
          <button onClick={handleClose} className="btn btn-primary">Close</button>
        </section>
      </div>
    );
  };

  export default Popup;