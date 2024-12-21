import "./editor.css";
import "katex/dist/katex.min.css";
export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      {/* En-tête spécifique au groupe "editor" */}
      {children}
    </main>
  );
}
