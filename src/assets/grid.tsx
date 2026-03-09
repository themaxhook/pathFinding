const Grid = () => {
  const rows = 40;
  const cols = 60;

  const cells = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push(
        <div key={`${r}-${c}`} className="node"></div>
      );
    }
  }

  return <div className="grid">{cells}</div>;
};

export default Grid;