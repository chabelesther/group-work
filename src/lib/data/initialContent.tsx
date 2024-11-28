export const initialContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: {
        textAlign: "left",
        level: 1,
      },
      content: [
        {
          type: "emoji",
          attrs: {
            name: "team",
          },
        },
        {
          type: "text",
          text: " Plateforme Collaborative d'Exposés de Groupe",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        class: null,
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "Bienvenue sur notre plateforme collaborative conçue pour faciliter la préparation et la réalisation d'exposés de groupe. Notre outil, construit avec ",
        },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://tiptap.dev/",
                target: "_blank",
                class: null,
              },
            },
          ],
          text: "Tiptap",
        },
        {
          type: "text",
          text: ", ",
        },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://nextjs.org/",
                target: "_blank",
                class: null,
              },
            },
          ],
          text: "Next.js",
        },
        {
          type: "text",
          text: " et ",
        },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://tailwindcss.com/",
                target: "_blank",
                class: null,
              },
            },
          ],
          text: "Tailwind",
        },
        {
          type: "text",
          text: " offre un environnement intuitif pour travailler ensemble sur vos présentations académiques.",
        },
      ],
    },
    {
      type: "codeBlock",
      attrs: {
        language: null,
      },
      content: [
        {
          type: "text",
          text: "// Exemple de collaboration en temps réel\nfunction preparerExpose(membres, sections) {\n  return collaborerEnTempsReel(membres, sections);\n}",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        class: null,
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "Fonctionnalités principales de notre plateforme :",
        },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "Interface de drag-and-drop pour réorganiser facilement les sections de l'exposé",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "Menu contextuel accessible via ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "code",
                    },
                  ],
                  text: "/",
                },
                {
                  type: "text",
                  text: " pour ajouter rapidement des éléments ou via le ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "bold",
                    },
                  ],
                  text: "bouton +",
                },
                {
                  type: "text",
                  text: " dans la marge",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "Outils de mise en forme avancés : personnalisation de la ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        fontSize: "18px",
                        fontFamily: null,
                        color: null,
                      },
                    },
                  ],
                  text: "taille de police",
                },
                {
                  type: "text",
                  text: ", ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "bold",
                    },
                  ],
                  text: "graisse",
                },
                {
                  type: "text",
                  text: ", ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        fontSize: null,
                        fontFamily: "Georgia",
                        color: null,
                      },
                    },
                  ],
                  text: "police",
                },
                {
                  type: "text",
                  text: ", ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        fontSize: null,
                        fontFamily: null,
                        color: "#b91c1c",
                      },
                    },
                  ],
                  text: "couleur",
                },
                {
                  type: "text",
                  text: ", ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "highlight",
                      attrs: {
                        color: "#7e7922",
                      },
                    },
                  ],
                  text: "surlignage",
                },
                {
                  type: "text",
                  text: " et plus encore",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "Table des matières dynamique pour naviguer rapidement dans l'exposé",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "Collaboration en temps réel avec synchronisation de contenu et curseurs collaboratifs",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "Suggestions d'IA pour la génération de contenu et l'auto-complétion via la touche ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "code",
                    },
                  ],
                  text: "TAB",
                },
                {
                  type: "text",
                  text: ".",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "imageBlock",
      attrs: {
        src: "/placeholder-presentation.jpg",
        width: "100%",
        align: "center",
      },
    },
    {
      type: "heading",
      attrs: {
        textAlign: "left",
        level: 2,
      },
      content: [
        {
          type: "text",
          text: "Commencer",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        class: null,
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "Créez votre compte et invitez vos coéquipiers à collaborer sur votre exposé. Répartissez les tâches, travaillez simultanément et produisez des présentations professionnelles.",
        },
      ],
    },
    {
      type: "heading",
      attrs: {
        textAlign: "left",
        level: 2,
      },
      content: [
        {
          type: "text",
          text: "Conseils pour une collaboration efficace",
        },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "Définissez clairement les rôles et sections de chaque membre",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "Utilisez les commentaires et annotations pour la communication",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "Vérifiez régulièrement la cohérence globale de la présentation",
                },
              ],
            },
          ],
        },
      ],
    },

    // TODO: add custom
    {
      type: "heading",
      attrs: {
        textAlign: "left",
        level: 1,
      },
      content: [
        {
          type: "emoji",
          attrs: {
            name: "fire",
          },
        },
        {
          type: "text",
          text: " Next.js + Tiptap Block Editor Template",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        class: null,
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "Welcome to our React Block Editor Template built on top of ",
        },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://tiptap.dev/",
                target: "_blank",
                class: null,
              },
            },
          ],
          text: "Tiptap",
        },
        {
          type: "text",
          text: ", ",
        },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://nextjs.org/",
                target: "_blank",
                class: null,
              },
            },
          ],
          text: "Next.js",
        },
        {
          type: "text",
          text: " and ",
        },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://tailwindcss.com/",
                target: "_blank",
                class: null,
              },
            },
          ],
          text: "Tailwind",
        },
        {
          type: "text",
          text: ". This project can be a good starting point for your own implementation of a block editor.",
        },
      ],
    },
    {
      type: "codeBlock",
      attrs: {
        language: null,
      },
      content: [
        {
          type: "text",
          text: "import { useEditor, EditorContent } from '@tiptap/react'\n\nfunction App() {\n  const editor = useEditor()\n\n  return <EditorContent editor={editor} />\n}",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        class: null,
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "This editor includes features like:",
        },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "A DragHandle including a DragHandle menu",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "A Slash menu that can be triggered via typing a ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "code",
                    },
                  ],
                  text: "/",
                },
                {
                  type: "text",
                  text: " into an empty paragraph or by using the ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "bold",
                    },
                  ],
                  text: "+ Button",
                },
                {
                  type: "text",
                  text: " next to the drag handle",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "A TextFormatting menu that allows you to change the ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        fontSize: "18px",
                        fontFamily: null,
                        color: null,
                      },
                    },
                  ],
                  text: "font size",
                },
                {
                  type: "text",
                  text: ", ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "bold",
                    },
                  ],
                  text: "font weight",
                },
                {
                  type: "text",
                  text: ", ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        fontSize: null,
                        fontFamily: "Georgia",
                        color: null,
                      },
                    },
                  ],
                  text: "font family",
                },
                {
                  type: "text",
                  text: ", ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        fontSize: null,
                        fontFamily: null,
                        color: "#b91c1c",
                      },
                    },
                  ],
                  text: "color",
                },
                {
                  type: "text",
                  text: ", ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "highlight",
                      attrs: {
                        color: "#7e7922",
                      },
                    },
                  ],
                  text: "highlight",
                },
                {
                  type: "text",
                  text: " and more",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "A Table of Contents that can be viewed via clicking on the button on the top left corner",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "Live collaboration including content synchronization and collaborative cursors",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "AI implementation with text and image generation and auto completion via the ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "code",
                    },
                  ],
                  text: "TAB",
                },
                {
                  type: "text",
                  text: " key.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "imageBlock",
      attrs: {
        src: "/placeholder-image.jpg",
        width: "100%",
        align: "center",
      },
    },

    {
      type: "paragraph",
      attrs: {
        class: null,
        textAlign: "left",
      },
    },
  ],
};
