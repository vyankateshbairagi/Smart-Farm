import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { crops, farms, irrigation } from '../services/api'
import { useSession } from '../context/SessionContext'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

const cardClass =
  'rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/25 ring-1 ring-inset ring-white/5 sm:p-8'

const panelClass = 'rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-4 ring-1 ring-inset ring-white/5'

const inputClass =
  'w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'

const labelClass = 'mb-2 block text-sm font-medium text-slate-200'

const primaryButtonClass =
  'inline-flex items-center justify-center rounded-2xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60'

const secondaryButtonClass =
  'inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60'

const sectionHeadingClass = 'text-2xl font-bold tracking-tight text-white'
const subheadingClass = 'mt-2 text-sm leading-6 text-slate-400'

const initialForm = {
  name: '',
  location: '',
  soilType: '',
  size: '',
}

const initialCropForm = {
  cropName: '',
  season: '',
  sowingDate: '',
  status: '',
}

const initialIrrigationForm = {
  soilType: '',
  temperature: '',
  humidity: '',
  rainProbability: '',
}

const mockExpenseData = [
  { month: 'Jan', expense: 1200 },
  { month: 'Feb', expense: 950 },
  { month: 'Mar', expense: 1400 },
  { month: 'Apr', expense: 1100 },
  { month: 'May', expense: 1600 },
  { month: 'Jun', expense: 1300 },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { logout, user } = useSession()
  const [farmList, setFarmList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [form, setForm] = useState(initialForm)
  const [formError, setFormError] = useState('')
  const [creating, setCreating] = useState(false)

  const [deletingId, setDeletingId] = useState('')

  const [selectedFarmId, setSelectedFarmId] = useState('')
  const [cropList, setCropList] = useState([])
  const [cropLoading, setCropLoading] = useState(false)
  const [cropError, setCropError] = useState('')

  const [cropForm, setCropForm] = useState(initialCropForm)
  const [cropFormError, setCropFormError] = useState('')
  const [creatingCrop, setCreatingCrop] = useState(false)

  const [irrigationForm, setIrrigationForm] = useState(initialIrrigationForm)
  const [irrigationError, setIrrigationError] = useState('')
  const [irrigationResult, setIrrigationResult] = useState(null)
  const [loadingRecommendation, setLoadingRecommendation] = useState(false)

  const farmCountData = [{ name: 'Farms', count: farmList.length }]
  const selectedFarm = farmList.find((farm) => farm._id === selectedFarmId)

  const handleAuthFailure = (err) => {
    if (err?.response?.status === 401) {
      logout()
      navigate('/login', { replace: true })
      return true
    }

    return false
  }

  const loadFarms = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await farms.list()
      const farmsData = response?.data || []
      setFarmList(farmsData)
      if (farmsData.length > 0) {
        setSelectedFarmId((prev) => prev || farmsData[0]._id)
      } else {
        setSelectedFarmId('')
      }
    } catch (err) {
      if (handleAuthFailure(err)) {
        return
      }

      setError(err?.response?.data?.message || 'Failed to fetch farms')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFarms()
  }, [])

  const loadCrops = async (farmId) => {
    if (!farmId) {
      setCropList([])
      return
    }

    try {
      setCropLoading(true)
      setCropError('')
      const response = await crops.listByFarm(farmId)
      setCropList(response?.data || [])
    } catch (err) {
      if (handleAuthFailure(err)) {
        return
      }

      setCropError(err?.response?.data?.message || 'Failed to fetch crops')
    } finally {
      setCropLoading(false)
    }
  }

  useEffect(() => {
    loadCrops(selectedFarmId)
  }, [selectedFarmId])

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onCreateFarm = async (event) => {
    event.preventDefault()
    setFormError('')

    if (!form.name.trim()) {
      setFormError('Farm name is required')
      return
    }

    const payload = {
      name: form.name.trim(),
      location: form.location.trim() || undefined,
      soilType: form.soilType.trim() || undefined,
      size: form.size ? Number(form.size) : undefined,
    }

    try {
      setCreating(true)
      const response = await farms.create(payload)
      setFarmList((prev) => [response.data, ...prev])
      setForm(initialForm)
    } catch (err) {
      if (handleAuthFailure(err)) {
        return
      }

      setFormError(err?.response?.data?.message || 'Failed to create farm')
    } finally {
      setCreating(false)
    }
  }

  const onDeleteFarm = async (id) => {
    try {
      setDeletingId(id)
      await farms.remove(id)
      setFarmList((prev) => prev.filter((farm) => farm._id !== id))
      if (selectedFarmId === id) {
        const nextFarm = farmList.find((farm) => farm._id !== id)
        setSelectedFarmId(nextFarm ? nextFarm._id : '')
      }
    } catch (err) {
      if (handleAuthFailure(err)) {
        return
      }

      setError(err?.response?.data?.message || 'Failed to delete farm')
    } finally {
      setDeletingId('')
    }
  }

  const onCropChange = (event) => {
    const { name, value } = event.target
    setCropForm((prev) => ({ ...prev, [name]: value }))
  }

  const onCreateCrop = async (event) => {
    event.preventDefault()
    setCropFormError('')

    if (!selectedFarmId) {
      setCropFormError('Select a farm first')
      return
    }
    if (!cropForm.cropName.trim()) {
      setCropFormError('Crop name is required')
      return
    }

    const payload = {
      farmId: selectedFarmId,
      cropName: cropForm.cropName.trim(),
      season: cropForm.season.trim() || undefined,
      sowingDate: cropForm.sowingDate || undefined,
      status: cropForm.status.trim() || undefined,
    }

    try {
      setCreatingCrop(true)
      const response = await crops.create(payload)
      setCropList((prev) => [response.data, ...prev])
      setCropForm(initialCropForm)
    } catch (err) {
      if (handleAuthFailure(err)) {
        return
      }

      setCropFormError(err?.response?.data?.message || 'Failed to create crop')
    } finally {
      setCreatingCrop(false)
    }
  }

  const onIrrigationChange = (event) => {
    const { name, value } = event.target
    setIrrigationForm((prev) => ({ ...prev, [name]: value }))
  }

  const onGetRecommendation = async (event) => {
    event.preventDefault()
    setIrrigationError('')
    setIrrigationResult(null)

    if (!irrigationForm.soilType.trim()) {
      setIrrigationError('Soil type is required')
      return
    }
    if (irrigationForm.temperature === '' || irrigationForm.humidity === '' || irrigationForm.rainProbability === '') {
      setIrrigationError('Temperature, humidity and rain probability are required')
      return
    }

    const temp = Number(irrigationForm.temperature)
    const humidity = Number(irrigationForm.humidity)
    const rainProbability = Number(irrigationForm.rainProbability)

    if (Number.isNaN(temp) || Number.isNaN(humidity) || Number.isNaN(rainProbability)) {
      setIrrigationError('Temperature, humidity and rain probability must be valid numbers')
      return
    }

    if (humidity < 0 || humidity > 100 || rainProbability < 0 || rainProbability > 100) {
      setIrrigationError('Humidity and rain probability should be between 0 and 100')
      return
    }

    try {
      setLoadingRecommendation(true)
      const response = await irrigation.recommend({
        soilType: irrigationForm.soilType.trim(),
        temperature: temp,
        humidity,
        rainProbability,
      })
      setIrrigationResult(response?.data || null)
    } catch (err) {
      if (handleAuthFailure(err)) {
        return
      }

      setIrrigationError(err?.response?.data?.message || 'Failed to get recommendation')
    } finally {
      setLoadingRecommendation(false)
    }
  }

  return (
    <section className="space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/25 ring-1 ring-inset ring-white/5 backdrop-blur">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.12),transparent_30%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-300">Dashboard</p>
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Manage your farms with a cleaner, more focused interface.</h2>
            <p className="max-w-2xl text-base leading-7 text-slate-300">Track farm records, crop updates, and irrigation recommendations without losing the structure of the original workflow.</p>
            <p className="text-sm text-slate-400">Signed in as <span className="font-semibold text-slate-200">{user?.name || 'User'}</span>.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Farms</p>
              <p className="mt-2 text-3xl font-black text-white">{farmList.length}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Crops</p>
              <p className="mt-2 text-3xl font-black text-white">{cropList.length}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Selected</p>
              <p className="mt-2 text-lg font-semibold text-white">{selectedFarm?.name || 'None'}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className={cardClass}>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h3 className={sectionHeadingClass}>Farm Analytics</h3>
              <p className={subheadingClass}>A quick view of farm volume and spending trends.</p>
            </div>
          </div>

          <div className="grid gap-6">
            <div className={panelClass}>
              <h4 className="mb-4 text-lg font-semibold text-white">Total Farms</h4>
              <div className="h-64 w-full">
                <ResponsiveContainer>
                  <BarChart data={farmCountData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis allowDecimals={false} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 16 }} />
                    <Bar dataKey="count" fill="#22c55e" radius={[12, 12, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={panelClass}>
              <h4 className="mb-4 text-lg font-semibold text-white">Monthly Expenses</h4>
              <div className="h-72 w-full">
                <ResponsiveContainer>
                  <LineChart data={mockExpenseData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 16 }} />
                    <Line type="monotone" dataKey="expense" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={onCreateFarm} className={cardClass}>
          <div className="mb-6">
            <h3 className={sectionHeadingClass}>Create Farm</h3>
            <p className={subheadingClass}>Add a new field, region, or production site.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className={labelClass}>Farm Name</label>
              <input id="name" name="name" type="text" value={form.name} onChange={onChange} placeholder="Farm name" className={inputClass} />
            </div>

            <div>
              <label htmlFor="location" className={labelClass}>Location</label>
              <input id="location" name="location" type="text" value={form.location} onChange={onChange} placeholder="Village / region" className={inputClass} />
            </div>

            <div>
              <label htmlFor="soilType" className={labelClass}>Soil Type</label>
              <input id="soilType" name="soilType" type="text" value={form.soilType} onChange={onChange} placeholder="Sandy / Loam / Clay" className={inputClass} />
            </div>

            <div>
              <label htmlFor="size" className={labelClass}>Size</label>
              <input id="size" name="size" type="number" min="0" step="0.1" value={form.size} onChange={onChange} placeholder="In acres/hectares" className={inputClass} />
            </div>

            {formError ? <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{formError}</p> : null}

            <button type="submit" disabled={creating} className={primaryButtonClass}>
              {creating ? 'Creating...' : 'Create Farm'}
            </button>
          </div>
        </form>
      </section>

      <section className={cardClass}>
        <div className="mb-6">
          <h3 className={sectionHeadingClass}>Your Farms</h3>
          <p className={subheadingClass}>Review saved farms and remove ones you no longer need.</p>
        </div>

        {loading ? <p className="text-slate-300">Loading farms...</p> : null}
        {error ? <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p> : null}
        {!loading && farmList.length === 0 ? <p className="text-slate-300">No farms yet. Create your first farm.</p> : null}

        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {farmList.map((farm) => (
            <li key={farm._id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 ring-1 ring-inset ring-white/5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-white">{farm.name}</p>
                  <p className="mt-1 text-sm text-slate-400">Location: {farm.location || 'N/A'}</p>
                </div>
                <button onClick={() => onDeleteFarm(farm._id)} disabled={deletingId === farm._id} className={secondaryButtonClass}>
                  {deletingId === farm._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>

              <dl className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Soil Type</dt>
                  <dd>{farm.soilType || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Size</dt>
                  <dd>{farm.size ?? 'N/A'}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className={cardClass}>
          <div className="mb-6">
            <h3 className={sectionHeadingClass}>Crop Management</h3>
            <p className={subheadingClass}>Choose a farm, add crops, and review what is currently planted.</p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="selectedFarmId" className={labelClass}>Select Farm</label>
              <select id="selectedFarmId" value={selectedFarmId} onChange={(event) => setSelectedFarmId(event.target.value)} className={inputClass} disabled={farmList.length === 0}>
                {farmList.length === 0 ? <option value="">No farms available</option> : null}
                {farmList.map((farm) => (
                  <option key={farm._id} value={farm._id}>
                    {farm.name}
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={onCreateCrop} className="space-y-4 rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-5 ring-1 ring-inset ring-white/5">
              <h4 className="text-lg font-semibold text-white">Add Crop</h4>

              <div>
                <label htmlFor="cropName" className={labelClass}>Crop Name</label>
                <input id="cropName" name="cropName" type="text" value={cropForm.cropName} onChange={onCropChange} placeholder="e.g. Wheat" className={inputClass} />
              </div>

              <div>
                <label htmlFor="season" className={labelClass}>Season</label>
                <input id="season" name="season" type="text" value={cropForm.season} onChange={onCropChange} placeholder="e.g. Kharif" className={inputClass} />
              </div>

              <div>
                <label htmlFor="sowingDate" className={labelClass}>Sowing Date</label>
                <input id="sowingDate" name="sowingDate" type="date" value={cropForm.sowingDate} onChange={onCropChange} className={inputClass} />
              </div>

              <div>
                <label htmlFor="status" className={labelClass}>Status</label>
                <input id="status" name="status" type="text" value={cropForm.status} onChange={onCropChange} placeholder="e.g. Sown" className={inputClass} />
              </div>

              {cropFormError ? <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{cropFormError}</p> : null}

              <button type="submit" disabled={creatingCrop || !selectedFarmId} className={primaryButtonClass}>
                {creatingCrop ? 'Adding...' : 'Add Crop'}
              </button>
            </form>
          </div>
        </div>

        <div className={cardClass}>
          <div className="mb-6">
            <h3 className={sectionHeadingClass}>Crops for Selected Farm</h3>
            <p className={subheadingClass}>The crop list updates automatically when you change farms.</p>
          </div>

          {cropLoading ? <p className="text-slate-300">Loading crops...</p> : null}
          {cropError ? <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{cropError}</p> : null}
          {!cropLoading && selectedFarmId && cropList.length === 0 ? <p className="text-slate-300">No crops found for this farm.</p> : null}
          {!selectedFarmId ? <p className="text-slate-300">Select a farm to view crops.</p> : null}

          <ul className="mt-6 grid gap-4">
            {cropList.map((crop) => (
              <li key={crop._id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 ring-1 ring-inset ring-white/5">
                <p className="text-lg font-semibold text-white">{crop.cropName}</p>
                <dl className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                  <div>
                    <dt className="text-slate-500">Season</dt>
                    <dd>{crop.season || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Sowing Date</dt>
                    <dd>{crop.sowingDate ? new Date(crop.sowingDate).toLocaleDateString() : 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Status</dt>
                    <dd>{crop.status || 'N/A'}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={cardClass}>
        <div className="mb-6">
          <h3 className={sectionHeadingClass}>Irrigation Recommendation</h3>
          <p className={subheadingClass}>Generate a watering suggestion based on soil and weather signals.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <form onSubmit={onGetRecommendation} className="space-y-4 rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-5 ring-1 ring-inset ring-white/5">
            <div>
              <label htmlFor="irrigationSoilType" className={labelClass}>Soil Type</label>
              <input id="irrigationSoilType" name="soilType" type="text" value={irrigationForm.soilType} onChange={onIrrigationChange} placeholder="e.g. sandy" className={inputClass} />
            </div>

            <div>
              <label htmlFor="temperature" className={labelClass}>Temperature (deg C)</label>
              <input id="temperature" name="temperature" type="number" value={irrigationForm.temperature} onChange={onIrrigationChange} placeholder="e.g. 32" className={inputClass} />
            </div>

            <div>
              <label htmlFor="humidity" className={labelClass}>Humidity (%)</label>
              <input id="humidity" name="humidity" type="number" min="0" max="100" value={irrigationForm.humidity} onChange={onIrrigationChange} placeholder="e.g. 45" className={inputClass} />
            </div>

            <div>
              <label htmlFor="rainProbability" className={labelClass}>Rain Probability (%)</label>
              <input id="rainProbability" name="rainProbability" type="number" min="0" max="100" value={irrigationForm.rainProbability} onChange={onIrrigationChange} placeholder="e.g. 70" className={inputClass} />
            </div>

            {irrigationError ? <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{irrigationError}</p> : null}

            <button type="submit" disabled={loadingRecommendation} className={primaryButtonClass}>
              {loadingRecommendation ? 'Getting recommendation...' : 'Get Recommendation'}
            </button>
          </form>

          {irrigationResult ? (
            <div className="rounded-[1.5rem] border border-amber-500/20 bg-amber-500/10 p-5 ring-1 ring-inset ring-amber-400/20">
              <h4 className="text-lg font-semibold text-white">Result</h4>
              <dl className="mt-4 space-y-4 text-sm text-slate-200">
                <div>
                  <dt className="text-slate-400">Recommendation</dt>
                  <dd className="mt-1 text-base font-medium text-white">{irrigationResult.recommendation || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Reason</dt>
                  <dd className="mt-1 text-base text-slate-100">{irrigationResult.reason || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Suggestion</dt>
                  <dd className="mt-1 text-base text-slate-100">{irrigationResult.suggestion || 'N/A'}</dd>
                </div>
              </dl>
            </div>
          ) : (
            <div className="grid place-items-center rounded-[1.5rem] border border-dashed border-white/15 bg-white/5 p-8 text-center text-slate-400">
              Submit the form to see an irrigation recommendation.
            </div>
          )}
        </div>
      </section>
    </section>
  )
}
