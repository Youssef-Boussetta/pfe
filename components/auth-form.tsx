"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Role = "candidate" | "company";
type Mode = "login" | "signup";

export function AuthForm({ role, mode }: { role: Role; mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [hardSkills, setHardSkills] = useState("");
  const [softSkills, setSoftSkills] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [nationality, setNationality] = useState("");

  const [companyType, setCompanyType] = useState("");
  const [sector, setSector] = useState("");
  const [size, setSize] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [taxId, setTaxId] = useState("");
  const [hrName, setHrName] = useState("");
  const [hrEmail, setHrEmail] = useState("");
  const [hrPhone, setHrPhone] = useState("");
  const [departments, setDepartments] = useState("");
  const [contractTypes, setContractTypes] = useState("");

  const title = useMemo(() => {
    const roleLabel = role === "candidate" ? "Candidat" : "Societe";
    return mode === "login" ? `Connexion ${roleLabel}` : `Inscription ${roleLabel}`;
  }, [mode, role]);

  const targetHome = role === "candidate" ? "/candidate/home" : "/company/home";
  const switchHref = `/auth/${role}/${mode === "login" ? "signup" : "login"}`;

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    localStorage.setItem("space_role", role);
    localStorage.setItem("space_user_email", email);
    if (name) localStorage.setItem("space_user_name", name);
    if (mode === "signup") {
      if (role === "candidate") {
        localStorage.setItem(
          "candidate_profile",
          JSON.stringify({
            full_name: name,
            email,
            phone,
            city,
            country,
            birth_date: birthDate,
            nationality,
            bio,
            hard_skills: hardSkills.split(",").map((item) => item.trim()).filter(Boolean),
            soft_skills: softSkills.split(",").map((item) => item.trim()).filter(Boolean),
          }),
        );
      } else {
        localStorage.setItem(
          "company_profile",
          JSON.stringify({
            company_name: name,
            email,
            phone,
            city,
            country,
            address,
            type: companyType,
            sector,
            size: Number(size || 0),
            website,
            registration_number: registrationNumber,
            tax_id: taxId,
            hr_contact: {
              name: hrName,
              email: hrEmail,
              phone: hrPhone,
            },
            departments: departments.split(",").map((item) => item.trim()).filter(Boolean),
            contract_types: contractTypes.split(",").map((item) => item.trim()).filter(Boolean),
          }),
        );
      }
    }
    router.push(targetHome);
  }

  return (
    <div className="min-h-screen bg-zinc-100 px-4 py-10">
      <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">{title}</h1>
        <p className="mt-2 text-sm text-zinc-600">Accedez a votre espace intelligent de recrutement.</p>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          {mode === "signup" ? (
            <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={role === "candidate" ? "Nom complet" : "Nom de la societe"}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
              />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <input
                  required
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Telephone"
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
                />
                <input
                  required
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="Ville"
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
                />
              </div>
              <input
                required
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                placeholder="Pays"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
              />

              {role === "candidate" ? (
                <>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <input
                      required
                      type="date"
                      value={birthDate}
                      onChange={(event) => setBirthDate(event.target.value)}
                      className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
                    />
                    <input
                      required
                      value={nationality}
                      onChange={(event) => setNationality(event.target.value)}
                      placeholder="Nationalite"
                      className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
                    />
                  </div>
                  <textarea
                    required
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    placeholder="Bio / Resume professionnel"
                    rows={3}
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
                  />
                  <input
                    required
                    value={hardSkills}
                    onChange={(event) => setHardSkills(event.target.value)}
                    placeholder="Hard skills (separees par virgule)"
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
                  />
                  <input
                    required
                    value={softSkills}
                    onChange={(event) => setSoftSkills(event.target.value)}
                    placeholder="Soft skills (separees par virgule)"
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
                  />
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <input
                      required
                      value={companyType}
                      onChange={(event) => setCompanyType(event.target.value)}
                      placeholder="Type (startup, PME...)"
                      className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
                    />
                    <input
                      required
                      value={sector}
                      onChange={(event) => setSector(event.target.value)}
                      placeholder="Secteur"
                      className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <input
                      required
                      type="number"
                      min={1}
                      value={size}
                      onChange={(event) => setSize(event.target.value)}
                      placeholder="Taille entreprise"
                      className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
                    />
                    <input
                      required
                      value={website}
                      onChange={(event) => setWebsite(event.target.value)}
                      placeholder="Website"
                      className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
                    />
                  </div>
                  <input
                    required
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Adresse"
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
                  />
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <input
                      required
                      value={registrationNumber}
                      onChange={(event) => setRegistrationNumber(event.target.value)}
                      placeholder="Numero registre commerce"
                      className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
                    />
                    <input
                      required
                      value={taxId}
                      onChange={(event) => setTaxId(event.target.value)}
                      placeholder="Tax ID"
                      className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
                    />
                  </div>
                  <p className="text-xs font-medium text-zinc-500">Contact RH</p>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <input
                      required
                      value={hrName}
                      onChange={(event) => setHrName(event.target.value)}
                      placeholder="Nom RH"
                      className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
                    />
                    <input
                      required
                      type="email"
                      value={hrEmail}
                      onChange={(event) => setHrEmail(event.target.value)}
                      placeholder="Email RH"
                      className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
                    />
                  </div>
                  <input
                    required
                    value={hrPhone}
                    onChange={(event) => setHrPhone(event.target.value)}
                    placeholder="Telephone RH"
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
                  />
                  <input
                    required
                    value={departments}
                    onChange={(event) => setDepartments(event.target.value)}
                    placeholder="Departements (separes par virgule)"
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
                  />
                  <input
                    required
                    value={contractTypes}
                    onChange={(event) => setContractTypes(event.target.value)}
                    placeholder="Types de contrat (CDI, CDD...)"
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
                  />
                </>
              )}
            </div>
          ) : null}
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Mot de passe"
            className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          />

          <button type="submit" className="w-full rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700">
            {mode === "login" ? "Se connecter" : "Creer un compte"}
          </button>
        </form>

        <p className="mt-4 text-sm text-zinc-600">
          {mode === "login" ? "Pas de compte ?" : "Vous avez deja un compte ?"}{" "}
          <Link href={switchHref} className="font-medium text-zinc-900 underline">
            {mode === "login" ? "Inscription" : "Connexion"}
          </Link>
        </p>
        <Link href="/" className="mt-2 inline-block text-xs text-zinc-500 underline">
          Changer de role
        </Link>
      </div>
    </div>
  );
}
