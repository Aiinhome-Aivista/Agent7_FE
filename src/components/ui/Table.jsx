import React from 'react';

const Table = React.forwardRef(({ className = '', ...props }, ref) => (
  <div className="relative w-full overflow-auto rounded-lg border border-border bg-card">
    <table ref={ref} className={`w-full caption-bottom text-sm ${className}`} {...props} />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef(({ className = '', ...props }, ref) => (
  <thead ref={ref} className={`[&_tr]:border-b bg-hover/50 ${className}`} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef(({ className = '', ...props }, ref) => (
  <tbody ref={ref} className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
));
TableBody.displayName = 'TableBody';

const TableRow = React.forwardRef(({ className = '', ...props }, ref) => (
  <tr
    ref={ref}
    className={`border-b border-border transition-colors hover:bg-hover/50 data-[state=selected]:bg-hover ${className}`}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef(({ className = '', ...props }, ref) => (
  <th
    ref={ref}
    className={`h-12 px-4 text-left align-middle font-semibold text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef(({ className = '', ...props }, ref) => (
  <td
    ref={ref}
    className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
