import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  ListChecks,
  Pause,
  Play,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const checklistItems = [
  { id: "CL-P01", type: "positive", title: "Форма регистрации отображается" },
  { id: "CL-P02", type: "positive", title: "Логин принимается в валидном формате" },
  { id: "CL-P03", type: "positive", title: "Пароль соответствует правилам" },
  { id: "CL-P04", type: "positive", title: "Повтор пароля совпадает с паролем" },
  { id: "CL-P05", type: "positive", title: "Email принимается в корректном формате" },
  { id: "CL-P06", type: "positive", title: "ФИО принимается в корректном формате" },
  { id: "CL-P07", type: "positive", title: "Сохранение валидной формы доступно" },
  { id: "CL-P08", type: "positive", title: "Успешная регистрация сохраняет данные" },
  { id: "CL-N01", type: "negative", title: "Пустая форма не отправляется" },
  { id: "CL-N02", type: "negative", title: "Некорректный логин отклоняется" },
  { id: "CL-N03", type: "negative", title: "Некорректный пароль отклоняется" },
  { id: "CL-N04", type: "negative", title: "Несовпадающий повтор пароля отклоняется" },
  { id: "CL-N05", type: "negative", title: "Некорректный email отклоняется" },
  { id: "CL-N06", type: "negative", title: "Некорректное ФИО отклоняется" },
  { id: "CL-N07", type: "negative", title: "Повторная отправка не создаёт дубль" },
];

const smokeItems = [
  { id: "SMK-01", type: "positive", title: "Открытие формы регистрации" },
  { id: "SMK-02", type: "positive", title: "Заполнение обязательных полей валидными данными" },
  { id: "SMK-03", type: "positive", title: "Успешное сохранение пользователя" },
  { id: "SMK-04", type: "negative", title: "Проверка обязательности полей" },
  { id: "SMK-05", type: "positive", title: "Проверка кнопки Назад" },
];

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

function Field({ label, value, active, error, type = "text", showEye = false, onToggleEye, eyeOn = false }) {
  return (
    <div className="grid grid-cols-[170px_1fr] items-center gap-5 py-1.5">
      <div className="text-[19px] font-medium text-slate-900">{label}</div>
      <div>
        <div className={cx(
          "flex items-center rounded-[2px] border-2 bg-white px-3 py-2 transition-all",
          active ? "border-amber-400 shadow-[0_0_0_3px_rgba(251,191,36,0.12)]" : "border-[#8f8f8f]"
        )}>
          <input
            value={value}
            type={type}
            readOnly
            className="w-full bg-transparent text-[16px] text-slate-900 outline-none"
          />
          {showEye && (
            <button type="button" onClick={onToggleEye} className="ml-2 text-slate-500 hover:text-slate-800" aria-label="toggle password">
              {eyeOn ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        <AnimatePresence>
          {error ? (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-1 text-xs text-rose-600">
              {error}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Pill({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-slate-100 text-slate-700",
    blue: "bg-cyan-100 text-cyan-800",
    green: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-rose-100 text-rose-800",
  };
  return <span className={cx("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", tones[tone])}>{children}</span>;
}

export default function App() {
  const [mode, setMode] = useState("checklist");
  const items = mode === "smoke" ? smokeItems : checklistItems;
  const [running, setRunning] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const timerRef = useRef(null);

  const current = items[index];
  const progress = Math.round(((index + 1) / items.length) * 100);

  useEffect(() => {
    setIndex(0);
    setHistory([]);
  }, [mode]);

  useEffect(() => {
    if (!running) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setHistory((prev) => {
        const next = [...prev, items[index]];
        return next.slice(-4);
      });
      setIndex((prev) => (prev + 1 >= items.length ? 0 : prev + 1));
    }, 2200);
    return () => clearInterval(timerRef.current);
  }, [running, index, items]);

  const fields = useMemo(
    () => ({
      login: "qa_user_01",
      password: showPassword ? "Qa!2026Pass" : "•••••••••••",
      repeatPassword: showPassword ? "Qa!2026Pass" : "•••••••••••",
      email: "qa.user@example.com",
      fullName: "Иванов Иван Иванович",
    }),
    [showPassword]
  );

  const activeField = current?.title?.toLowerCase() || "";
  const isActive = (name) => activeField.includes(name);
  const isNegative = current?.type === "negative";

  const reset = () => {
    setIndex(0);
    setHistory([]);
    setRunning(true);
  };

  return (
    <div className="min-h-screen bg-[#f4f0f7] px-4 py-8 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 lg:flex-row">
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Форма регистрации пользователя</h1>
              <p className="text-sm text-slate-600">Минималистичный локальный демо-стенд с имитацией выполнения QA-проверок.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setMode("checklist")} className={cx("rounded-full px-4 py-2 text-sm font-medium transition", mode === "checklist" ? "bg-slate-900 text-white" : "bg-white text-slate-700 shadow-sm")}>Чек-лист</button>
              <button onClick={() => setMode("smoke")} className={cx("rounded-full px-4 py-2 text-sm font-medium transition", mode === "smoke" ? "bg-slate-900 text-white" : "bg-white text-slate-700 shadow-sm")}>Smoke-test</button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2px] border border-[#dad7e3] bg-[#eceaf2] shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between bg-[#8a87c7] px-4 py-3 text-white">
              <div className="text-[20px] font-semibold">Регистрация пользователя</div>
              <div className="flex items-center gap-2 text-[12px] opacity-95">
                <ShieldCheck className="h-4 w-4" />
                {running ? "авто-режим" : "пауза"}
              </div>
            </div>

            <div className="grid gap-0 p-8 pr-10">
              <Field label="Логин" value={fields.login} active={isActive("логин")} error={current?.title?.includes("логин") && isNegative ? "Логин отклонён" : ""} />
              <Field label="Пароль" value={fields.password} type={showPassword ? "text" : "password"} active={isActive("пароль")} showEye eyeOn={showPassword} onToggleEye={() => setShowPassword((v) => !v)} error={current?.title?.includes("пароль") && isNegative ? "Пароль отклонён" : ""} />
              <Field label="Повтор пароля" value={fields.repeatPassword} type={showPassword ? "text" : "password"} active={isActive("повтор")} error={current?.title?.includes("повтор") && isNegative ? "Пароли не совпадают" : ""} />
              <Field label="Email" value={fields.email} active={isActive("email")} error={current?.title?.includes("email") && isNegative ? "Email отклонён" : ""} />
              <Field label="ФИО" value={fields.fullName} active={isActive("фио")} error={current?.title?.includes("фио") && isNegative ? "ФИО отклонено" : ""} />

              <div className="mt-3 flex items-center justify-between pt-2">
                <button className={cx("rounded-[3px] px-10 py-3 text-[20px] font-medium transition", isActive("назад") ? "bg-[#f6a51e] text-black shadow-[0_0_0_3px_rgba(246,165,30,0.15)]" : "bg-gradient-to-b from-[#f4c14d] to-[#de8f00] text-black") }>
                  <ArrowLeft className="mr-2 inline h-5 w-5" /> Назад
                </button>
                <button className={cx("rounded-[3px] px-10 py-3 text-[20px] font-medium transition", isActive("сохранение") || isActive("сохранить") || isActive("успешное") ? "bg-gradient-to-b from-[#ffd782] to-[#efb45b] text-black shadow-[0_0_0_3px_rgba(239,180,91,0.15)]" : "bg-gradient-to-b from-[#ffd782] to-[#efb45b] text-black") }>
                  <Save className="mr-2 inline h-5 w-5" /> Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="w-full lg:w-[310px]">
          <div className="sticky top-6 space-y-4 rounded-3xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between">
              <Pill tone={mode === "checklist" ? "blue" : "green"}>{mode === "checklist" ? "Чек-лист" : "Smoke-test"}</Pill>
              <button onClick={() => setRunning((v) => !v)} className="rounded-full bg-slate-900 px-3 py-2 text-white transition hover:opacity-90">
                {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                <span>Прогресс</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <motion.div className="h-full rounded-full bg-slate-900" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ type: "spring", stiffness: 100, damping: 20 }} />
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Текущий пункт</div>
              <AnimatePresence mode="wait">
                <motion.div key={current?.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-2">
                  <div className="flex items-center gap-2">
                    {current?.type === "negative" ? <Circle className="h-4 w-4 text-rose-500" /> : <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                    <span className="text-sm font-semibold text-slate-800">{current?.id}</span>
                  </div>
                  <p className="text-sm text-slate-700">{current?.title}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Последние проверки</div>
              <div className="space-y-2">
                {history.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-3 text-sm text-slate-500">Пока ничего не выполнено.</div>
                ) : (
                  history.slice().reverse().map((item) => (
                    <div key={item.id} className={cx("rounded-2xl border p-3 text-sm", item.type === "negative" ? "border-rose-200 bg-rose-50" : "border-emerald-200 bg-emerald-50") }>
                      <div className="font-semibold text-slate-800">{item.id}</div>
                      <div className="text-slate-600">{item.title}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-xs text-slate-600">
              <Sparkles className="h-4 w-4" />
              <span>Приколюха Гаврилова Алексея</span>
            </div>

            <div className="flex gap-2">
              <button onClick={reset} className="flex-1 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
                <RotateCcw className="mr-2 inline h-4 w-4" /> Сброс
              </button>
              <button onClick={() => setMode(mode === "checklist" ? "smoke" : "checklist")} className="flex-1 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
                <ListChecks className="mr-2 inline h-4 w-4" /> Режим
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
