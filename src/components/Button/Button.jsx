function Button({ children, onClick, type = "button" }) {
  return (
    <button 
      type={type}
      onClick={onClick}
      style={{  

        padding: "10px 16px", 
        border: "none",
        borderRadius: "8px",
        background: "#2563eb",
        color: "white", 
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      {children}
    </button>
  );
}

export default Button;