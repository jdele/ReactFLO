import React from "react";
import { StateDisplay } from "./StateDisplay";
import PropDisplay from "./PropDisplay";
import { DisplayNode } from "../backend/interfaces";

interface RightPanelProps {
  clickedNode: DisplayNode,
  selectProp: Function,
  clearTree: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
}


const RightPanel = (props: RightPanelProps) => {

  // state on line 7 is destructered from the clicked node we recieved from onclick 
  const { type, state, name } = props.clickedNode;
  return (
    <div>
      <h1>Component Data</h1>
      <h2> Component Type: {type || "Anonymous"}</h2>
      <h2> Component Name: {name || "Anonymous"}</h2>
      <button onClick={props.clearTree}>Clear Selection</button>
      <StateDisplay 
        title='State:' 
        json={state ? state.value : null} />

      <PropDisplay 
        title='Props:' 
        propList={props.clickedNode.props} 
        selectProp={props.selectProp} 
        />
    </div>
  )
}

export default RightPanel;