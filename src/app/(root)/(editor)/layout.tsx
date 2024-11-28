import "./editor.css";
import "katex/dist/katex.min.css";
export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* En-tête spécifique au groupe "editor" */}
      <header>
        <h1>Éditeur</h1>
      </header>

      {children}
    </div>
  );
}
