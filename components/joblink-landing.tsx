"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SelectFile from "./SelectFile";

const slogans = [
  "Connecter les talents et les entreprises intelligemment.",
  "Publiez, postulez et recrutez en temps reel.",
  "Le matching CV-offre automatise pour aller plus vite.",
];

type Role = "candidate" | "company";

type CandidateSignupState = {
  first_name: string;
  last_name: string;
  birth_date: string;
  nationality: string;
  profile_photo: any;
  country: string;
  city: string;
  address: string;
  postal_code: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  password: string;
};

type CompanySignupState = {
  company_name: string;
  commercial_name: string;
  logo_url: string;
  description: string;
  sector: string;
  size: number;
  type: string;
  created_date: string;
  website: string;
  country: string;
  city: string;
  address: string;
  postal_code: string;
  phone: string;
  email: string;
  timezone: string;
  registration_number: string;
  tax_id: string;
  vat_number: string;
  legal_form: string;
  legal_representative: string;
  registration_country: string;
  hr_first_name: string;
  hr_last_name: string;
  hr_email: string;
  hr_phone: string;
  hr_role: string;
  departments: string[];
  contract_types: string[];
  recruitment_language: string;
  recruitment_policy: string;
  password: string;
};

const initialCandidate: CandidateSignupState = {
  first_name: "",
  last_name: "",
  birth_date: "",
  nationality: "",
  profile_photo: "",
  country: "",
  city: "",
  address: "",
  postal_code: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  password: "",
};

const initialCompany: CompanySignupState = {
  company_name: "",
  commercial_name: "",
  logo_url: "",
  description: "",
  sector: "",
  size: 1,
  type: "",
  created_date: "",
  website: "",
  country: "",
  city: "",
  address: "",
  postal_code: "",
  phone: "",
  email: "",
  timezone: "",
  registration_number: "",
  tax_id: "",
  vat_number: "",
  legal_form: "",
  legal_representative: "",
  registration_country: "",
  hr_first_name: "",
  hr_last_name: "",
  hr_email: "",
  hr_phone: "",
  hr_role: "",
  departments: [""],
  contract_types: [""],
  recruitment_language: "",
  recruitment_policy: "",
  password: "",
};

export function JobLinkLanding() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<Role>("candidate");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [candidateForm, setCandidateForm] = useState<CandidateSignupState>(initialCandidate);
  const [companyForm, setCompanyForm] = useState<CompanySignupState>(initialCompany);
  const [profilePhoto, setProfilePhoto] = useState<any>(null);
  const [sloganIndex, setSloganIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const activeSlogan = useMemo(() => slogans[sloganIndex], [sloganIndex]);
console.log("candidateForm", candidateForm);
console.log("company ", companyForm)
console.log("profilePhoto", profilePhoto);
  useEffect(() => {
    const id = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % slogans.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  async function login() {
    setErrorMessage("");
    const response = await fetch("/api/joblink/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setErrorMessage(payload.error ?? "Connexion echouee.");
      return;
    }
    localStorage.setItem("joblink_session", JSON.stringify(payload));
    router.push("/feed");
  }

  async function signup() {
    setErrorMessage("");
    const body = role === "candidate" ? { role, ...candidateForm } : { role, ...companyForm };
    const response = await fetch("/api/joblink/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok) {
      setErrorMessage(payload.error ?? "Inscription echouee.");
      return;
    }
    localStorage.setItem("joblink_session", JSON.stringify(payload));
    router.push("/feed");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-6 py-10 md:grid-cols-2 md:items-center">
        <section>
          <h1 className="bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-5xl font-bold text-transparent">
            JobLINK
          </h1>
          <div className="mt-6 min-h-14">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeSlogan}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="text-lg text-zinc-200"
              >
                {activeSlogan}
              </motion.p>
            </AnimatePresence>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 backdrop-blur">
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setMode("login")}
              className={`rounded-lg px-4 py-2 text-sm ${mode === "login" ? "bg-blue-500 text-white" : "bg-zinc-800 text-zinc-200"}`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`rounded-lg px-4 py-2 text-sm ${mode === "signup" ? "bg-violet-500 text-white" : "bg-zinc-800 text-zinc-200"}`}
            >
              S&apos;inscrire
            </button>
          </div>

          {mode === "login" ? (
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
              />
              <button onClick={() => void login()} className="w-full rounded-lg bg-blue-500 py-2 font-medium">
                Se connecter
              </button>
            </div>
          ) : (
            <div className="max-h-[70vh] space-y-3 overflow-auto pr-1">
              <div className="flex gap-4 rounded-lg border border-zinc-800 p-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" checked={role === "candidate"} onChange={() => setRole("candidate")} />
                  Candidat
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" checked={role === "company"} onChange={() => setRole("company")} />
                  Societe
                </label>
              </div>

              {role === "candidate" ? (
                <div className="space-y-2">
                  <input placeholder="Nom" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={candidateForm.last_name} onChange={(e) => setCandidateForm((p) => ({ ...p, last_name: e.target.value }))} />
                  <input placeholder="Prenom" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={candidateForm.first_name} onChange={(e) => setCandidateForm((p) => ({ ...p, first_name: e.target.value }))} />
                  <input type="date" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={candidateForm.birth_date} onChange={(e) => setCandidateForm((p) => ({ ...p, birth_date: e.target.value }))} />
                  <input placeholder="Nationalite" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={candidateForm.nationality} onChange={(e) => setCandidateForm((p) => ({ ...p, nationality: e.target.value }))} />                  
                  <SelectFile setFile={setProfilePhoto} file={profilePhoto} isPressed={profilePhoto !== null} />
                  <input placeholder="Pays" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={candidateForm.country} onChange={(e) => setCandidateForm((p) => ({ ...p, country: e.target.value }))} />
                  <input placeholder="Ville" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={candidateForm.city} onChange={(e) => setCandidateForm((p) => ({ ...p, city: e.target.value }))} />
                  <input placeholder="Adresse" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={candidateForm.address} onChange={(e) => setCandidateForm((p) => ({ ...p, address: e.target.value }))} />
                  <input placeholder="Code postal" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={candidateForm.postal_code} onChange={(e) => setCandidateForm((p) => ({ ...p, postal_code: e.target.value }))} />
                  <input type="email" placeholder="Email" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={candidateForm.email} onChange={(e) => setCandidateForm((p) => ({ ...p, email: e.target.value }))} />
                  <input placeholder="Telephone" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={candidateForm.phone} onChange={(e) => setCandidateForm((p) => ({ ...p, phone: e.target.value }))} />
                  <input placeholder="LinkedIn" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={candidateForm.linkedin} onChange={(e) => setCandidateForm((p) => ({ ...p, linkedin: e.target.value }))} />
                  <input placeholder="GitHub" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={candidateForm.github} onChange={(e) => setCandidateForm((p) => ({ ...p, github: e.target.value }))} />
                  <input type="password" placeholder="Mot de passe" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={candidateForm.password} onChange={(e) => setCandidateForm((p) => ({ ...p, password: e.target.value }))} />
                </div>
              ) : (
                <div className="space-y-2">
                  <input placeholder="Nom de l'entreprise" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.company_name} onChange={(e) => setCompanyForm((p) => ({ ...p, company_name: e.target.value }))} />
                  <input placeholder="Nom commercial" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.commercial_name} onChange={(e) => setCompanyForm((p) => ({ ...p, commercial_name: e.target.value }))} />
                  <input placeholder="Photo URL (optionnelle)" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.logo_url} onChange={(e) => setCompanyForm((p) => ({ ...p, logo_url: e.target.value }))} />
                  <textarea placeholder="Description" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.description} onChange={(e) => setCompanyForm((p) => ({ ...p, description: e.target.value }))} />
                  <input placeholder="Secteur" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.sector} onChange={(e) => setCompanyForm((p) => ({ ...p, sector: e.target.value }))} />
                  <input type="number" placeholder="Taille" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.size} onChange={(e) => setCompanyForm((p) => ({ ...p, size: Number(e.target.value || 1) }))} />
                  <input placeholder="Type entreprise" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.type} onChange={(e) => setCompanyForm((p) => ({ ...p, type: e.target.value }))} />
                  <input type="date" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.created_date} onChange={(e) => setCompanyForm((p) => ({ ...p, created_date: e.target.value }))} />
                  <input placeholder="Site web" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.website} onChange={(e) => setCompanyForm((p) => ({ ...p, website: e.target.value }))} />
                  <input placeholder="Pays" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.country} onChange={(e) => setCompanyForm((p) => ({ ...p, country: e.target.value }))} />
                  <input placeholder="Ville" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.city} onChange={(e) => setCompanyForm((p) => ({ ...p, city: e.target.value }))} />
                  <input placeholder="Adresse" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.address} onChange={(e) => setCompanyForm((p) => ({ ...p, address: e.target.value }))} />
                  <input placeholder="Code postal" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.postal_code} onChange={(e) => setCompanyForm((p) => ({ ...p, postal_code: e.target.value }))} />
                  <input placeholder="Telephone pro" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.phone} onChange={(e) => setCompanyForm((p) => ({ ...p, phone: e.target.value }))} />
                  <input type="email" placeholder="Email pro" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.email} onChange={(e) => setCompanyForm((p) => ({ ...p, email: e.target.value }))} />
                  <input placeholder="Fuseau horaire" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.timezone} onChange={(e) => setCompanyForm((p) => ({ ...p, timezone: e.target.value }))} />
                  <input placeholder="Numero RC" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.registration_number} onChange={(e) => setCompanyForm((p) => ({ ...p, registration_number: e.target.value }))} />
                  <input placeholder="Identifiant fiscal" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.tax_id} onChange={(e) => setCompanyForm((p) => ({ ...p, tax_id: e.target.value }))} />
                  <input placeholder="Numero TVA" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.vat_number} onChange={(e) => setCompanyForm((p) => ({ ...p, vat_number: e.target.value }))} />
                  <input placeholder="Forme juridique" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.legal_form} onChange={(e) => setCompanyForm((p) => ({ ...p, legal_form: e.target.value }))} />
                  <input placeholder="Representant legal" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.legal_representative} onChange={(e) => setCompanyForm((p) => ({ ...p, legal_representative: e.target.value }))} />
                  <input placeholder="Pays d'enregistrement" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.registration_country} onChange={(e) => setCompanyForm((p) => ({ ...p, registration_country: e.target.value }))} />
                  <input placeholder="RH Nom" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.hr_last_name} onChange={(e) => setCompanyForm((p) => ({ ...p, hr_last_name: e.target.value }))} />
                  <input placeholder="RH Prenom" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.hr_first_name} onChange={(e) => setCompanyForm((p) => ({ ...p, hr_first_name: e.target.value }))} />
                  <input type="email" placeholder="RH Email login" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.hr_email} onChange={(e) => setCompanyForm((p) => ({ ...p, hr_email: e.target.value }))} />
                  <input placeholder="RH Telephone" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.hr_phone} onChange={(e) => setCompanyForm((p) => ({ ...p, hr_phone: e.target.value }))} />
                  <input placeholder="Fonction RH" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.hr_role} onChange={(e) => setCompanyForm((p) => ({ ...p, hr_role: e.target.value }))} />
                  <div>
                    <p className="mb-1 text-xs text-zinc-300">Departements</p>
                    {companyForm.departments.map((department, idx) => (
                      <input
                        key={`dep-${idx}`}
                        placeholder={`Departement ${idx + 1}`}
                        className="mb-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
                        value={department}
                        onChange={(e) =>
                          setCompanyForm((prev) => ({
                            ...prev,
                            departments: prev.departments.map((item, index) => (index === idx ? e.target.value : item)),
                          }))
                        }
                      />
                    ))}
                    <button className="rounded-md bg-zinc-800 px-2 py-1 text-xs" onClick={() => setCompanyForm((prev) => ({ ...prev, departments: [...prev.departments, ""] }))}>
                      + Ajouter departement
                    </button>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-zinc-300">Types de contrat</p>
                    {companyForm.contract_types.map((item, idx) => (
                      <input
                        key={`ct-${idx}`}
                        placeholder={`Contrat ${idx + 1}`}
                        className="mb-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
                        value={item}
                        onChange={(e) =>
                          setCompanyForm((prev) => ({
                            ...prev,
                            contract_types: prev.contract_types.map((value, index) => (index === idx ? e.target.value : value)),
                          }))
                        }
                      />
                    ))}
                    <button className="rounded-md bg-zinc-800 px-2 py-1 text-xs" onClick={() => setCompanyForm((prev) => ({ ...prev, contract_types: [...prev.contract_types, ""] }))}>
                      + Ajouter contrat
                    </button>
                  </div>
                  <input placeholder="Langue recrutement" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.recruitment_language} onChange={(e) => setCompanyForm((p) => ({ ...p, recruitment_language: e.target.value }))} />
                  <textarea placeholder="Politique recrutement (optionnel)" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.recruitment_policy} onChange={(e) => setCompanyForm((p) => ({ ...p, recruitment_policy: e.target.value }))} />
                  <input type="password" placeholder="Mot de passe" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" value={companyForm.password} onChange={(e) => setCompanyForm((p) => ({ ...p, password: e.target.value }))} />
                </div>
              )}
              <button onClick={() => void signup()} className="w-full rounded-lg bg-violet-500 py-2 font-medium">
                Creer mon compte
              </button>
            </div>
          )}
          {errorMessage ? <p className="mt-3 text-sm text-rose-300">{errorMessage}</p> : null}
        </section>
      </div>
    </main>
  );
}
