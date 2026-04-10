const STORAGE_KEY = "domliniya-site-content";

const editorGroups = [
  {
    title: "Бренд и контакты",
    fields: [
      ["siteTitle", "Заголовок вкладки"],
      ["metaDescription", "Описание сайта"],
      ["brandName", "Название компании"],
      ["brandTagline", "Подзаголовок бренда"],
      ["phone", "Телефон"],
      ["email", "Email"],
      ["footerText", "Текст в подвале"]
    ]
  },
  {
    title: "Первый экран",
    fields: [
      ["heroEyebrow", "Надзаголовок"],
      ["heroTitle", "Главный заголовок"],
      ["heroText", "Описание"],
      ["heroPrimaryButton", "Текст главной кнопки"],
      ["heroSecondaryButton", "Текст второй кнопки"],
      ["heroPoint1", "Преимущество 1"],
      ["heroPoint2", "Преимущество 2"],
      ["heroPoint3", "Преимущество 3"],
      ["heroMainCardLabel", "Карточка 1: метка"],
      ["heroMainCardValue", "Карточка 1: значение"],
      ["heroMainCardText", "Карточка 1: текст"],
      ["heroAccentCardLabel", "Карточка 2: метка"],
      ["heroAccentCardValue", "Карточка 2: значение"],
      ["heroAccentCardText", "Карточка 2: текст"],
      ["heroBadgeTitle", "Бейдж: заголовок"],
      ["heroBadgeText", "Бейдж: текст"]
    ]
  },
  {
    title: "Цифры и преимущества",
    fields: [
      ["metric1Value", "Метрика 1: значение"],
      ["metric1Text", "Метрика 1: текст"],
      ["metric2Value", "Метрика 2: значение"],
      ["metric2Text", "Метрика 2: текст"],
      ["metric3Value", "Метрика 3: значение"],
      ["metric3Text", "Метрика 3: текст"],
      ["aboutEyebrow", "Блок преимуществ: надзаголовок"],
      ["aboutTitle", "Блок преимуществ: заголовок"],
      ["feature1Title", "Преимущество 1: заголовок"],
      ["feature1Text", "Преимущество 1: текст"],
      ["feature2Title", "Преимущество 2: заголовок"],
      ["feature2Text", "Преимущество 2: текст"],
      ["feature3Title", "Преимущество 3: заголовок"],
      ["feature3Text", "Преимущество 3: текст"],
      ["feature4Title", "Преимущество 4: заголовок"],
      ["feature4Text", "Преимущество 4: текст"]
    ]
  },
  {
    title: "Проекты",
    fields: [
      ["projectsEyebrow", "Проекты: надзаголовок"],
      ["projectsTitle", "Проекты: заголовок"],
      ["project1Label", "Проект 1: метка"],
      ["project1Title", "Проект 1: заголовок"],
      ["project1Text", "Проект 1: текст"],
      ["project2Label", "Проект 2: метка"],
      ["project2Title", "Проект 2: заголовок"],
      ["project2Text", "Проект 2: текст"],
      ["project3Label", "Проект 3: метка"],
      ["project3Title", "Проект 3: заголовок"],
      ["project3Text", "Проект 3: текст"]
    ]
  },
  {
    title: "Этапы и заявка",
    fields: [
      ["processEyebrow", "Этапы: надзаголовок"],
      ["processTitle", "Этапы: заголовок"],
      ["step1Title", "Шаг 1: заголовок"],
      ["step1Text", "Шаг 1: текст"],
      ["step2Title", "Шаг 2: заголовок"],
      ["step2Text", "Шаг 2: текст"],
      ["step3Title", "Шаг 3: заголовок"],
      ["step3Text", "Шаг 3: текст"],
      ["step4Title", "Шаг 4: заголовок"],
      ["step4Text", "Шаг 4: текст"],
      ["ctaEyebrow", "CTA: надзаголовок"],
      ["ctaTitle", "CTA: заголовок"],
      ["ctaButton", "CTA: текст кнопки"]
    ]
  }
];

const editableNodes = [...document.querySelectorAll("[data-edit-key]")];
const form = document.querySelector(".site-editor__form");
const toggleButton = document.querySelector(".editor-toggle");
const editor = document.querySelector(".site-editor");
const closeButton = document.querySelector(".site-editor__close");
const saveButton = document.querySelector(".site-editor__save");
const resetButton = document.querySelector(".site-editor__reset");
const exportButton = document.querySelector(".site-editor__export");
const importInput = document.querySelector(".site-editor__file");

const defaults = editableNodes.reduce((acc, node) => {
  const key = node.dataset.editKey;
  if (acc[key]) {
    return acc;
  }

  if (node.tagName === "META") {
    acc[key] = node.getAttribute("content") || "";
    return acc;
  }

  acc[key] = node.textContent.trim();
  return acc;
}, {});

function getStoredContent() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function buildEditor() {
  form.innerHTML = "";

  editorGroups.forEach((group) => {
    const section = document.createElement("section");
    section.className = "site-editor__group";

    const title = document.createElement("h3");
    title.textContent = group.title;
    section.appendChild(title);

    group.fields.forEach(([key, label]) => {
      const wrapper = document.createElement("label");
      wrapper.className = "site-editor__field";

      const text = document.createElement("span");
      text.textContent = label;
      wrapper.appendChild(text);

      const input = key === "heroText" || key === "metaDescription" || key.endsWith("Text") || key.endsWith("Title")
        ? document.createElement("textarea")
        : document.createElement("input");

      input.name = key;
      input.value = defaults[key] || "";
      wrapper.appendChild(input);
      section.appendChild(wrapper);
    });

    form.appendChild(section);
  });
}

function applyContent(content) {
  editableNodes.forEach((node) => {
    const key = node.dataset.editKey;
    const value = content[key] ?? defaults[key] ?? "";

    if (node.tagName === "META") {
      node.setAttribute("content", value);
      return;
    }

    node.textContent = value;

    if (node.dataset.editType === "tel") {
      node.href = `tel:${value.replace(/[^\d+]/g, "")}`;
    }

    if (node.dataset.editType === "email") {
      node.href = `mailto:${value}`;
    }
  });

  const titleNode = document.querySelector("title[data-edit-key='siteTitle']");
  if (titleNode) {
    document.title = titleNode.textContent;
  }

  const brandMark = document.querySelector("[data-edit-key='brandMark']");
  if (brandMark) {
    const companyName = content.brandName || defaults.brandName || "DL";
    const letters = companyName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
    brandMark.textContent = letters || "DL";
  }
}

function getFormContent() {
  const formData = new FormData(form);
  return Object.fromEntries(formData.entries());
}

function syncForm(content) {
  [...form.elements].forEach((field) => {
    if (!field.name) {
      return;
    }
    field.value = content[field.name] ?? defaults[field.name] ?? "";
  });
}

function setEditorState(isOpen) {
  editor.classList.toggle("is-open", isOpen);
  toggleButton.setAttribute("aria-expanded", String(isOpen));
  editor.setAttribute("aria-hidden", String(!isOpen));
  document.body.classList.toggle("editor-open", isOpen);
}

buildEditor();
const initialContent = { ...defaults, ...getStoredContent() };
syncForm(initialContent);
applyContent(initialContent);

toggleButton.addEventListener("click", () => {
  setEditorState(!editor.classList.contains("is-open"));
});

closeButton.addEventListener("click", () => {
  setEditorState(false);
});

saveButton.addEventListener("click", () => {
  const nextContent = getFormContent();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextContent));
  applyContent({ ...defaults, ...nextContent });
});

resetButton.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  syncForm(defaults);
  applyContent(defaults);
});

exportButton.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(getFormContent(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "site-content.json";
  link.click();
  URL.revokeObjectURL(url);
});

importInput.addEventListener("change", async (event) => {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  try {
    const text = await file.text();
    const content = JSON.parse(text);
    syncForm({ ...defaults, ...content });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...defaults, ...content }));
    applyContent({ ...defaults, ...content });
  } catch {
    window.alert("Не удалось загрузить настройки. Проверь JSON-файл.");
  } finally {
    importInput.value = "";
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setEditorState(false);
  }
});
