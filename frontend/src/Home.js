import "./styles.css";
import { Link } from "react-router-dom";

export default function Home({ titles }) {
  return (
    <div className="Home">
      <h1>Paul Graham's Blog</h1>
      {titles.map(({ id, name }) => (
        <Link key={id} to={"/posts/" + id}>{name}</Link>
      ))}
    </div>
  );
}
