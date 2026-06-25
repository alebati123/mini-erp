import React from 'react';
import { useAppContext } from '../context/AppContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const { data } = useAppContext();
  const { balances } = data;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
  };

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
      <h1>Panel General</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Resumen financiero combinado</p>

      <div className="summary-cards">
        <div className="glass-panel summary-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="title">Balance Total</span>
            <DollarSign color="var(--accent-abshine)" />
          </div>
          <span className="value">{formatCurrency(balances.balanceTotal)}</span>
        </div>
        <div className="glass-panel summary-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="title">Ingresos</span>
            <TrendingUp color="var(--success)" />
          </div>
          <span className="value" style={{ color: 'var(--success)' }}>{formatCurrency(balances.ingresos)}</span>
        </div>
        <div className="glass-panel summary-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="title">Egresos</span>
            <TrendingDown color="var(--danger)" />
          </div>
          <span className="value" style={{ color: 'var(--danger)' }}>{formatCurrency(balances.egresos)}</span>
        </div>
      </div>

      <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={balances.history}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorEgresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="var(--text-secondary)" />
            <YAxis stroke="var(--text-secondary)" />
            <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--glass-border)', borderRadius: '10px' }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
            <Area type="monotone" dataKey="ingresos" stroke="var(--success)" fillOpacity={1} fill="url(#colorIngresos)" />
            <Area type="monotone" dataKey="egresos" stroke="var(--danger)" fillOpacity={1} fill="url(#colorEgresos)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
