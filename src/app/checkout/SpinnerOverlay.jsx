const SpinnerOverlay = () => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
  >
    <div className="spinner-border text-light" role="status" style={{ width: "3rem", height: "3rem" }}>
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export default SpinnerOverlay;