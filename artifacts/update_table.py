import os

filepath = r"c:\project\CenterKick\src\components\admin\payments\TransactionsClient.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

replacements = [
    # Table Cell Padding
    ('className="px-5 py-12 text-center"', 'className="px-3 py-12 text-center"'),
    ('className="px-5 py-3.5"', 'className="px-3 py-2.5"'),
    ('className="px-5 py-3.5 text-right"', 'className="px-3 py-2.5 text-right"'),
    
    # Reference Column
    ('font-extrabold text-gray-900 uppercase text-xs tracking-tight', 'font-extrabold text-gray-900 uppercase text-[11px] tracking-tight'),
    ('text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">ID:', 'text-[10px] font-semibold text-gray-400 mt-0.5">ID:'),
    
    # Payer Column
    ('font-bold text-gray-900 leading-none text-xs', 'font-bold text-gray-900 leading-none text-[11px]'),
    ('text-xs font-medium text-gray-400 mt-1">{tx.profiles?.email}', 'text-[10px] font-medium text-gray-400 mt-0.5 truncate max-w-[160px]">{tx.profiles?.email}'),
    
    # Amount Column
    ('font-extrabold text-gray-900 text-sm italic tracking-tight', 'font-extrabold text-gray-900 text-xs italic tracking-tight'),
    ('text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{currency}', 'text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{currency}'),
    
    # Gateway Column
    ('flex items-center gap-2', 'flex items-center gap-1.5'),
    ('Globe className="w-4 h-4 text-black"', 'Globe className="w-3.5 h-3.5 text-black shrink-0"'),
    ('text-xs font-bold text-gray-700 uppercase tracking-widest', 'text-[10px] font-bold text-gray-700 uppercase tracking-wider'),
    
    # Status Column
    ('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest', 'inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider'),
    ('{tx.status === \'confirmed\' ? <CheckCircle className="w-3.5 h-3.5" /> : tx.status === \'failed\' ? <XCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}', '{tx.status === \'confirmed\' ? <CheckCircle className="w-3 h-3" /> : tx.status === \'failed\' ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}'),
    
    # Date Column
    ('DateDisplay date={tx.created_at} className="text-xs font-bold text-gray-800 uppercase"', 'DateDisplay date={tx.created_at} className="text-[10px] font-bold text-gray-800 uppercase"'),
    ('className="text-xs font-medium text-gray-400 mt-1"', 'className="text-[9px] font-medium text-gray-400 mt-0.5"'),
    
    # Actions Layout
    ('flex items-center justify-end gap-2.5', 'flex items-center justify-end gap-1.5'),
    ('Eye className="w-4 h-4"', 'Eye className="w-3.5 h-3.5"')
]

for old, new in replacements:
    content = content.replace(old, new)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Update completed successfully.")
