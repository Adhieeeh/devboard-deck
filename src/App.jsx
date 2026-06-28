import React, { useState, useEffect } from 'react';


const DEFAULT_TICKETS = [
  { id: 't1', title: ' Implement OAuth2 Authorization Code Grant', priority: 'High', status: 'Backlog', summary: 'Configure secure client-side redirect callbacks and access token rotation registers.' },
  { id: 't2', title: ' Optimize Database Query Caching Layers', priority: 'Medium', status: 'InProgress', summary: 'Inject Redis caching parameters over heavy aggregation endpoints to decrease latency.' },
  { id: 't3', title: ' Refactor Main Layout Grid Components', priority: 'Low', status: 'Done', summary: 'Migrate legacy absolute margin positions over to fluid flex box columns.' }
];

function App() {
 
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('devboard_tickets');
    return saved ? JSON.parse(saved) : DEFAULT_TICKETS;
  });

  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newSummary, setNewSummary] = useState('');
  const [selectedLane, setSelectedLane] = useState('Backlog');
  const [priorityFilter, setPriorityFilter] = useState('ALL');


  useEffect(() => {
    localStorage.setItem('devboard_tickets', JSON.stringify(tickets));
  }, [tickets]);

  const moveTicket = (id, newStatus) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };


  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const freshTicket = {
      id: `t_${Date.now()}`,
      title: newTitle,
      priority: newPriority,
      status: selectedLane,
      summary: newSummary || 'No additional engineering context logs provided.'
    };

    setTickets([...tickets, freshTicket]);
    setNewTitle('');
    setNewSummary('');
  };

  const deleteTicket = (id) => {
    setTickets(tickets.filter(t => t.id !== id));
  };


  const totalCount = tickets.length;
  const doneCount = tickets.filter(t => t.status === 'Done').length;
  const sprintProgress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;


  const filteredTickets = tickets.filter(t => priorityFilter === 'ALL' || t.priority === priorityFilter);


  const columns = [
    { id: 'Backlog', label: ' Sprint Backlog', next: 'InProgress', prev: null },
    { id: 'InProgress', label: ' In Progress', next: 'Done', prev: 'Backlog' },
    { id: 'Done', label: '✅ Verified Done', next: null, prev: 'InProgress' }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px', fontFamily: 'system-ui, sans-serif', backgroundColor: '#090d16', color: '#f8fafc', minHeight: '90vh' }}>
      
      {/*  */}
      <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '25px', marginBottom: '35px', gap: '20px' }}>
        <div>
          <h1 style={{ margin: '0', fontSize: '26px', fontWeight: '800', color: '#3b82f6', letterSpacing: '-0.5px' }}> DevBoard Agile Console</h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>A high-performance Kanban workflow engine built to orchestrate and track technical sprint tasks.</p>
        </div>
        
        {/* */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['ALL', 'High', 'Medium', 'Low'].map(p => (
              <button 
                key={p} 
                onClick={() => setPriorityFilter(p)}
                style={{ border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: priorityFilter === p ? '#3b82f6' : '#1e293b', color: priorityFilter === p ? '#fff' : '#94a3b8', transition: '0.15s' }}
              >
                {p}
              </button>
            ))}
          </div>
          <div style={{ backgroundColor: '#111827', border: '1px solid #1e293b', padding: '10px 20px', borderRadius: '12px', textAlign: 'right' }}>
            <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Sprint Velocity</span>
            <h3 style={{ margin: '0', fontSize: '20px', color: '#10b981' }}>{sprintProgress}% Complete</h3>
          </div>
        </div>
      </header>

      {/* */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px', marginBottom: '40px', alignItems: 'start' }}>
        {columns.map(col => (
          <section key={col.id} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px', minHeight: '400px' }}>
            <h2 style={{ fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 20px 0', borderBottom: '1px solid #1e293b', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <span>{col.label}</span>
              <span style={{ backgroundColor: '#1e293b', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>
                {filteredTickets.filter(t => t.status === col.id).length}
              </span>
            </h2>

            {/*  */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredTickets.filter(t => t.status === col.id).map(ticket => (
                <article key={ticket.id} style={{ backgroundColor: '#020617', border: '1px solid #1e293b', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ 
                      fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '4px',
                      backgroundColor: ticket.priority === 'High' ? 'rgba(239, 68, 68, 0.1)' : ticket.priority === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: ticket.priority === 'High' ? '#ef4444' : ticket.priority === 'Medium' ? '#f59e0b' : '#10b981'
                    }}>{ticket.priority} Priority</span>
                    <button onClick={() => deleteTicket(ticket.id)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '12px' }}>✕</button>
                  </div>
                  
                  <h4 style={{ margin: '0', fontSize: '15px', color: '#f8fafc', fontWeight: '600', lineHeight: '1.4' }}>{ticket.title}</h4>
                  <p style={{ margin: '0', fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>{ticket.summary}</p>
                  
                  {/* */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                    <button disabled={!col.prev} onClick={() => moveTicket(ticket.id, col.prev)} style={{ padding: '4px 8px', backgroundColor: '#1e293b', border: 'none', color: '#cbd5e1', borderRadius: '4px', fontSize: '11px', cursor: col.prev ? 'pointer' : 'not-allowed', opacity: col.prev ? 1 : 0.3 }}>◀ Back</button>
                    <button disabled={!col.next} onClick={() => moveTicket(ticket.id, col.next)} style={{ padding: '4px 8px', backgroundColor: '#3b82f6', border: 'none', color: '#fff', borderRadius: '4px', fontSize: '11px', cursor: col.next ? 'pointer' : 'not-allowed', opacity: col.next ? 1 : 0.3 }}>Adv ➔</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/*  */}
      <section style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '25px', borderRadius: '16px', marginBottom: '40px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase' }}>Inject Engineering Sprint Ticket</h3>
        <form onSubmit={handleCreateTicket} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>Ticket Title</label>
            <input type="text" placeholder="Fix payload sanitization hooks..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>Context Scope</label>
            <input type="text" placeholder="Short description block summary..." value={newSummary} onChange={(e) => setNewSummary(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>Priority Level</label>
            <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)} style={{ width: '100%', padding: '9px', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff', fontSize: '13px' }}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>Target Destination Lane</label>
            <select value={selectedLane} onChange={(e) => setSelectedLane(e.target.value)} style={{ width: '100%', padding: '9px', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff', fontSize: '13px' }}>
              <option value="Backlog">Backlog</option>
              <option value="InProgress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <button type="submit" style={{ padding: '11px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>Deploy Ticket ➕</button>
        </form>
      </section>

    </div>
  );
}

export default App;