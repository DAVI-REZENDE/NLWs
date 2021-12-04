export function ExpirienceBar() {
  return (
    <header className="expirience-bar">
      <span>0 xp</span>
      <div>
        <div style={{width: '50%'}}>
          <span className="current-expirience" style={{ left: '50%'}}>
          300 xp
          </span>
        </div>
      </div>
      <span>600 xp</span>
    </header>
  );
}