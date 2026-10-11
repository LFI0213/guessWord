import "./WordPreview.css";

function WordPreview({size=45,fontSize=20,gap=6,style}) {
  return (
    <div 
      className="word-preview"
      style={{
        "--tile-size":`${size}px`,
        "--tile-font-size":`${fontSize}px`,
        "--tile-gap":`${gap}px`,
        ...style
      }}
    >
      <span className="preview-tile correct">G</span>
      <span className="preview-tile wrong-position">U</span>
      <span className="preview-tile not-in-word">E</span>
      <span className="preview-tile correct">S</span>
      <span className="preview-tile">S</span>
    </div>
  );
}

export default WordPreview;