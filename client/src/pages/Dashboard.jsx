export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <div className="page">
      <h1>Mirësevini në G-coode</h1>
      <p>Përdoruesi: <strong>{user.firstName} {user.lastName}</strong> — roli: <strong>{user.role}</strong></p>
    </div>
  );
}
