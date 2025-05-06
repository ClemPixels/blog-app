import React from "react";
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer>
      <div className="footer-socials">
        <a
          href="http://youtube.com/@ClemTech-d7u"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaYoutube />
        </a>
        <a
          href="https://www.facebook.com/Clemtec"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebookF />
        </a>
        <a
          href="https://www.instagram.com/clement_442?igsh=dHJ6aDFud3Y5ejQ2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram />.
        </a>
        <a
          href="www.linkedin.com/in/clement-kwasi-a16089342"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://x.com/ClemPixells"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub />
        </a>
      </div>
      <div className="container footer-container">
        <Article
          title="Categories"
          items={[
            "Art",
            "Wild Life",
            "Travel",
            "Music",
            "Science & Technology",
            "Food",
          ]}
        />
        <Article
          title="Support"
          items={[
            "Online Support",
            "Call Numbers",
            "Emails",
            "Social Support",
            "Location",
          ]}
          extraClass="sppt"
        />
        <Article
          title="Blog"
          items={["Safety", "Repair", "Recent", "Popular", "Categories"]}
        />
        <Article
          title="Permalinks"
          items={["Home", "Blog", "About", "Services", "Contact"]}
          extraClass="permalinks-container"
        />
      </div>
      <div className="footer-copyright">
        <small>Copyright &copy; 2024 CLEMPIXELS</small>
      </div>
    </footer>
  );
};

const Article = ({ title, items = [], extraClass = "" }) => {
  return (
    <article className={extraClass}>
      <h4>{title}</h4>
      <ul>
        {items.length > 0 ? (
          items.map((item, index) => (
            <li key={index}>
              <a href={item.toLowerCase()}>{item}</a>
            </li>
          ))
        ) : (
          <li>No items available</li>
        )}
      </ul>
    </article>
  );
};

export default Footer;
