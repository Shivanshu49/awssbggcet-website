'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Search,
  Download,
  Mail,
  MessageSquare,
  QrCode,
  School,
  Building,
  MapPin,
  Loader2,
  Plus,
  Database
} from 'lucide-react';
import Link from 'next/link';
import { COLLEGES_DATABASE, CollegeRecord } from '@/lib/registration/colleges-data';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'registrations' | 'colleges'>('registrations');
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Colleges directory management state
  const [colleges, setColleges] = useState<CollegeRecord[]>(COLLEGES_DATABASE);
  const [collegeSearch, setCollegeSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCollege, setNewCollege] = useState<Partial<CollegeRecord>>({
    institutionType: 'Engineering & Technology',
    source: 'AICTE / UPTAC Verified',
    isApproved: true,
  });

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/registrations${search ? `?query=${encodeURIComponent(search)}` : ''}`);
      const data = await res.json();
      setRegistrations(data.registrations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [search]);

  const total = registrations.length;
  const confirmed = registrations.filter((r) => r.status === 'confirmed').length;
  const checkedIn = registrations.filter((r) => r.checkedIn).length;

  const filteredColleges = colleges.filter((c) =>
    c.name.toLowerCase().includes(collegeSearch.toLowerCase()) ||
    c.city.toLowerCase().includes(collegeSearch.toLowerCase()) ||
    c.aliases.some((a) => a.toLowerCase().includes(collegeSearch.toLowerCase()))
  );

  const handleAddCollege = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollege.name || !newCollege.city || !newCollege.state) return;

    const record: CollegeRecord = {
      id: `col-${Date.now()}`,
      name: newCollege.name!,
      aliases: (newCollege.aliases as any) ? (newCollege.aliases as any).split(',').map((s: string) => s.trim()) : [],
      city: newCollege.city!,
      state: newCollege.state!,
      campusAddress: newCollege.campusAddress || '',
      institutionType: newCollege.institutionType || 'Engineering & Technology',
      website: newCollege.website || '',
      source: 'AICTE / UPTAC Verified',
      isApproved: true,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setColleges([record, ...colleges]);
    setShowAddModal(false);
    setNewCollege({ institutionType: 'Engineering & Technology', source: 'AICTE / UPTAC Verified', isApproved: true });
  };

  return (
    <div className="min-h-screen bg-[#090511] text-white p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#4C2A66]/50">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Event Operations & Registry</h1>
            <p className="text-xs text-[#A89DB5] mt-1">Real-time attendee telemetry, verification, & college datasets</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/check-in"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
            >
              <QrCode className="w-4 h-4" />
              <span>Launch QR Scanner</span>
            </Link>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 border-b border-[#4C2A66]/40 pb-2">
          <button
            onClick={() => setActiveTab('registrations')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'registrations'
                ? 'bg-[#2A1545] text-amber-300 border border-amber-400/40 shadow-md'
                : 'text-[#A89DB5] hover:text-white'
            }`}
          >
            Attendee Registrations ({total})
          </button>
          <button
            onClick={() => setActiveTab('colleges')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'colleges'
                ? 'bg-[#2A1545] text-amber-300 border border-amber-400/40 shadow-md'
                : 'text-[#A89DB5] hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Colleges Directory ({colleges.length})</span>
          </button>
        </div>

        {activeTab === 'registrations' ? (
          <>
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl bg-[#100B18] border border-[#4C2A66]/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#A89DB5]">
                  <span>TOTAL REGISTRATIONS</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-3xl font-extrabold text-white">{total}</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#100B18] border border-[#4C2A66]/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#A89DB5]">
                  <span>CONFIRMED PASSES</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-3xl font-extrabold text-emerald-400">{confirmed}</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#100B18] border border-[#4C2A66]/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#A89DB5]">
                  <span>VENUE CHECK-INS</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-3xl font-extrabold text-amber-300">{checkedIn}</p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89DB5]" />
                <input
                  type="text"
                  placeholder="Search by attendee name, email, phone, or registration ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#100B18] border border-[#4C2A66]/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Registrations Data Table */}
            <div className="rounded-2xl border border-[#4C2A66]/60 bg-[#100B18] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#170E25] text-[#A89DB5] border-b border-[#4C2A66]/60 uppercase font-mono tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Registration ID</th>
                      <th className="px-5 py-3.5">Attendee</th>
                      <th className="px-5 py-3.5">College & Branch</th>
                      <th className="px-5 py-3.5">City & State</th>
                      <th className="px-5 py-3.5">Delivery</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Pass</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#4C2A66]/30">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-[#A89DB5]">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-400" />
                          Loading registrations...
                        </td>
                      </tr>
                    ) : registrations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-[#A89DB5]">
                          No attendee registrations found.
                        </td>
                      </tr>
                    ) : (
                      registrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-white/[0.02] transition">
                          <td className="px-5 py-4 font-mono font-bold text-amber-300">
                            {reg.registrationId}
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-bold text-white">{reg.firstName} {reg.lastName}</p>
                            <p className="text-[11px] text-[#A89DB5]">{reg.academicYear}</p>
                          </td>
                          <td className="px-5 py-4 text-[#C4B5DA]">
                            <p className="line-clamp-1">{reg.college}</p>
                            <p className="text-[11px] text-[#A89DB5]">{reg.branch}</p>
                          </td>
                          <td className="px-5 py-4 space-y-0.5">
                            <p className="text-[#C4B5DA]">{reg.city}</p>
                            <p className="text-[11px] text-[#A89DB5]">{reg.state}</p>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <span
                                title={`Email: ${reg.emailStatus}`}
                                className={`p-1 rounded-md border ${
                                  reg.emailStatus === 'sent'
                                    ? 'bg-purple-950/60 border-purple-500/40 text-purple-300'
                                    : 'bg-red-950/60 border-red-500/40 text-red-300'
                                }`}
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </span>
                              <span
                                title={`WhatsApp: ${reg.whatsappStatus}`}
                                className={`p-1 rounded-md border ${
                                  reg.whatsappStatus === 'sent'
                                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                                    : 'bg-neutral-900 border-neutral-700 text-neutral-500'
                                }`}
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            {reg.checkedIn ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">
                                CHECKED IN
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-amber-950/60 text-amber-300 border border-amber-500/40">
                                CONFIRMED
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => window.open(`/api/pass/${reg.registrationId}`, '_blank')}
                              className="px-2.5 py-1.5 rounded-lg bg-[#211235] hover:bg-[#2F1A4A] text-amber-300 text-xs font-mono border border-purple-500/40 transition inline-flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              <span>PDF</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* Colleges Directory Tab */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89DB5]" />
                <input
                  type="text"
                  placeholder="Search college by name, city, or alias..."
                  value={collegeSearch}
                  onChange={(e) => setCollegeSearch(e.target.value)}
                  className="w-full bg-[#100B18] border border-[#4C2A66]/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#6B21A8] hover:bg-[#7E22CE] text-white font-bold text-xs flex items-center gap-2 border border-purple-400/40 transition shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Institution</span>
              </button>
            </div>

            <div className="rounded-2xl border border-[#4C2A66]/60 bg-[#100B18] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#170E25] text-[#A89DB5] border-b border-[#4C2A66]/60 uppercase font-mono tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Institution Name</th>
                      <th className="px-5 py-3.5">Aliases</th>
                      <th className="px-5 py-3.5">Location</th>
                      <th className="px-5 py-3.5">Type</th>
                      <th className="px-5 py-3.5">Data Source</th>
                      <th className="px-5 py-3.5 text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#4C2A66]/30">
                    {filteredColleges.map((col) => (
                      <tr key={col.id} className="hover:bg-white/[0.02] transition">
                        <td className="px-5 py-4 font-semibold text-white">
                          <div>{col.name}</div>
                          {col.website && (
                            <a
                              href={col.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-amber-300/80 hover:underline"
                            >
                              {col.website}
                            </a>
                          )}
                        </td>
                        <td className="px-5 py-4 font-mono text-purple-300">
                          {col.aliases.join(', ') || '—'}
                        </td>
                        <td className="px-5 py-4 text-[#C4B5DA]">
                          <div>{col.city}</div>
                          <div className="text-[10px] text-[#A89DB5]">{col.state}</div>
                        </td>
                        <td className="px-5 py-4 text-[#A89DB5]">{col.institutionType}</td>
                        <td className="px-5 py-4 font-mono text-[10px] text-[#A89DB5]">
                          {col.source}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">
                            Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal for adding college */}
            {showAddModal && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <form
                  onSubmit={handleAddCollege}
                  className="bg-[#12071E] border border-[#4C2A66] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl"
                >
                  <h3 className="text-lg font-bold text-white">Add New College / Institution</h3>

                  <div>
                    <label className="block text-xs font-mono text-[#C4B5DA] mb-1">Official College Name *</label>
                    <input
                      type="text"
                      required
                      value={newCollege.name || ''}
                      onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
                      className="w-full bg-[#1A0E2A] border border-[#4C2A66]/60 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#C4B5DA] mb-1">Aliases (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. GCET, Galgotias"
                      value={newCollege.aliases as any || ''}
                      onChange={(e) => setNewCollege({ ...newCollege, aliases: e.target.value as any })}
                      className="w-full bg-[#1A0E2A] border border-[#4C2A66]/60 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-[#C4B5DA] mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={newCollege.city || ''}
                        onChange={(e) => setNewCollege({ ...newCollege, city: e.target.value })}
                        className="w-full bg-[#1A0E2A] border border-[#4C2A66]/60 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#C4B5DA] mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={newCollege.state || ''}
                        onChange={(e) => setNewCollege({ ...newCollege, state: e.target.value })}
                        className="w-full bg-[#1A0E2A] border border-[#4C2A66]/60 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 rounded-xl text-xs text-[#A89DB5] hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs uppercase"
                    >
                      Save College
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
