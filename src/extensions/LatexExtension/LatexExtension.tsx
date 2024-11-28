import { Node, mergeAttributes } from "@tiptap/core";
import katex from "katex";

export const CustomLatex = Node.create({
  name: "latex", // Nom du nœud

  group: "inline", // Groupe où il peut être utilisé (inline ou block)
  inline: true,

  // Définir les attributs du nœud
  addAttributes() {
    return {
      value: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-value"),
        renderHTML: (attributes) => ({
          "data-value": attributes.value,
        }),
      },
    };
  },

  // Définir comment le nœud est représenté en HTML
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), ""];
  },

  // Transformer l'entrée utilisateur en contenu
  parseHTML() {
    return [
      {
        tag: 'span[data-type="latex"]',
      },
    ];
  },

  // Rendu React ou DOM pour afficher LaTeX
  addNodeView() {
    return ({ node, getPos, editor }) => {
      const span = document.createElement("span");
      const { value } = node.attrs;

      try {
        // Rendu KaTeX
        span.innerHTML = katex.renderToString(value, {
          throwOnError: false,
        });
      } catch (err) {
        span.innerText = "Erreur dans le LaTeX";
      }

      span.contentEditable = "false";
      span.classList.add("latex-node");
      return {
        dom: span,
        update: (updatedNode) => {
          if (updatedNode.attrs.value === value) return true;

          span.innerHTML = katex.renderToString(updatedNode.attrs.value, {
            throwOnError: false,
          });
          return true;
        },
      };
    };
  },
});
