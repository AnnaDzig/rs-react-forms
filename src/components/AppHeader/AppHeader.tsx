import './AppHeader.css';

export function AppHeader() {
  return (
    <header className="app-header">
      <p className="app-header__eyebrow">React Forms Task</p>
      <h1 className="app-header__title">Form handling with React</h1>
      <p className="app-header__description">
        Compare an uncontrolled form with a React Hook Form implementation.
        Successful submissions will be saved and displayed below.
      </p>
    </header>
  );
}
