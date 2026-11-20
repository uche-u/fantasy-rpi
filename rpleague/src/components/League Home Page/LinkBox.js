import React from 'react';
import './LinkBox.css';
function LinkBox({ link, label }) {
  return (
    <div class="col-sm-6">
      <div class="card h-100">
        <div class="card-body">
          <p class="card-text"><a href={link} class="stretched-link">{label}</a></p>
        </div>
      </div>
    </div>
  )
}
export default LinkBox;
