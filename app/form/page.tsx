"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { ArrowLeftIcon, UserCheckIcon } from "@/components/icons";

type Gender = "L" | "P" | "";
type Disorder = "Y" | "N" | "";

type FormState = {
  nama: string;
  gender: Gender;
  usia: string;
  tinggi: string;
  berat: string;
  disorder: Disorder;
};

type Errors = Partial<Record<keyof FormState, string>>;

const initial: FormState = {
  nama: "",
  gender: "",
  usia: "",
  tinggi: "",
  berat: "",
  disorder: "",
};

export default function FormPage() {
  const router = useRouter();
  const [data, setData] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setData((d) => ({ ...d, [key]: value }));
    if (touched) setErrors(validate({ ...data, [key]: value }));
  }

  function validate(d: FormState): Errors {
    const e: Errors = {};
    if (!d.nama.trim()) e.nama = "Nama lengkap wajib diisi";
    if (!d.gender) e.gender = "Pilih jenis kelamin";
    if (!d.usia.trim()) e.usia = "Usia wajib diisi";
    if (!d.tinggi.trim()) e.tinggi = "Tinggi badan wajib diisi";
    if (!d.berat.trim()) e.berat = "Berat badan wajib diisi";
    if (!d.disorder) e.disorder = "Pilih salah satu opsi";
    return e;
  }

  function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    setTouched(true);
    const e = validate(data);
    setErrors(e);
    if (Object.keys(e).length === 0) {
      try {
        sessionStorage.setItem("posturografi.patient", JSON.stringify(data));
      } catch {}
      router.push("/analytic");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-[672px] px-4 sm:px-6 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:text-brand-600 px-3 py-2 rounded-lg"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Kembali ke Dashboard
          </Link>

          <form
            onSubmit={onSubmit}
            noValidate
            className="mt-4 rounded-[14px] border border-brand-200 bg-white shadow-card"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-2 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 mb-4">
                <UserCheckIcon className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-normal text-ink-deep tracking-tight">
                Data Identitas Pemeriksaan
              </h2>
              <p className="mt-2 text-base text-ink-subtle">
                Lengkapi data diri Anda sebelum memulai pemeriksaan
              </p>
            </div>

            {/* Body */}
            <div className="px-6 pb-6 pt-4 flex flex-col gap-6">
              <Field
                label="Nama Lengkap"
                required
                error={errors.nama}
              >
                <input
                  type="text"
                  value={data.nama}
                  onChange={(e) => update("nama", e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className={inputCls(!!errors.nama)}
                />
              </Field>

              <Fieldset
                legend="Jenis Kelamin"
                required
                error={errors.gender}
              >
                <RadioOption
                  name="gender"
                  value="L"
                  checked={data.gender === "L"}
                  onChange={() => update("gender", "L")}
                  label="Laki-laki"
                />
                <RadioOption
                  name="gender"
                  value="P"
                  checked={data.gender === "P"}
                  onChange={() => update("gender", "P")}
                  label="Perempuan"
                />
              </Fieldset>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Usia" required error={errors.usia} suffix="tahun">
                  <input
                    type="number"
                    min={0}
                    value={data.usia}
                    onChange={(e) => update("usia", e.target.value)}
                    placeholder="0"
                    className={inputCls(!!errors.usia, true)}
                  />
                </Field>
                <Field
                  label="Tinggi Badan"
                  required
                  error={errors.tinggi}
                  suffix="cm"
                >
                  <input
                    type="number"
                    min={0}
                    value={data.tinggi}
                    onChange={(e) => update("tinggi", e.target.value)}
                    placeholder="0"
                    className={inputCls(!!errors.tinggi, true)}
                  />
                </Field>
                <Field
                  label="Berat Badan"
                  required
                  error={errors.berat}
                  suffix="kg"
                >
                  <input
                    type="number"
                    min={0}
                    value={data.berat}
                    onChange={(e) => update("berat", e.target.value)}
                    placeholder="0"
                    className={inputCls(!!errors.berat, true)}
                  />
                </Field>
              </div>

              <Fieldset
                legend="Apakah memiliki kelainan keseimbangan?"
                required
                error={errors.disorder}
              >
                <RadioOption
                  name="disorder"
                  value="Y"
                  checked={data.disorder === "Y"}
                  onChange={() => update("disorder", "Y")}
                  label="Ya"
                />
                <RadioOption
                  name="disorder"
                  value="N"
                  checked={data.disorder === "N"}
                  onChange={() => update("disorder", "N")}
                  label="Tidak"
                />
              </Fieldset>

              <button
                type="submit"
                className="rounded-lg bg-brand-600 hover:bg-brand-700 transition-colors text-white text-sm font-medium py-2.5"
              >
                Mulai Pemeriksaan
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

/* ---------- field primitives ---------- */

function inputCls(hasError: boolean, withSuffix = false) {
  return [
    "w-full h-9 rounded-lg bg-surface-muted px-3 text-sm text-ink placeholder:text-ink-subtle",
    "border outline-none focus:ring-2 focus:ring-brand-500/30",
    hasError ? "border-danger" : "border-transparent focus:border-brand-500",
    withSuffix ? "pr-10 text-right" : "",
  ].join(" ");
}

function Field({
  label,
  required,
  error,
  suffix,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  suffix?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-ink">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="relative">
        {children}
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-ink-subtle">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}

function Fieldset({
  legend,
  required,
  error,
  children,
}: {
  legend: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-medium text-ink mb-1">
        {legend} {required && <span className="text-danger">*</span>}
      </legend>
      <div className="flex flex-col gap-2">{children}</div>
      {error && <p className="text-sm text-danger">{error}</p>}
    </fieldset>
  );
}

function RadioOption({
  name,
  value,
  checked,
  onChange,
  label,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-ink select-none">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-brand-600"
      />
      {label}
    </label>
  );
}
