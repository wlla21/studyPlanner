import { useState } from "react";
import { FileManager } from "@cubone/react-file-manager";
import "@cubone/react-file-manager/dist/style.css";

const Note = () => {
  return (
    <div>
      <h1>Note</h1>
      <FileManager />
    </div>
  );
};

export default Note;
