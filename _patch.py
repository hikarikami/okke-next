import re

path = '/c/projects/okke-next/src/routes/transactions/AddTransactionModal.svelte'
with open(path, 'r') as f:
    lines = f.readlines()

# Find start/end of the col-span-2 category div (lines are 0-indexed)
start = None
end = None
for i, line in enumerate(lines):
    if 'col-span-2' in line and start is None:
        start = i
    if start is not None and i > start and '</div>' in line:
        # Check the indent level matches (5 tabs)
        stripped = line.lstrip('\t')
        tabs = len(line) - len(stripped)
        if tabs == 5 and stripped.startswith('</div>'):
            end = i
            break

if start is None or end is None:
    print(f"Could not find section: start={start}, end={end}")
    for i, l in enumerate(lines[274:325], 275):
        print(f"{i}: {repr(l)}")
else:
    print(f"Found section: lines {start+1} to {end+1}")
    replacement = '''\t\t\t\t\t<div class="col-span-2">
\t\t\t\t\t\t<p id="category-label" class="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">Category</p>
\t\t\t\t\t\t<Combobox.Root
\t\t\t\t\t\t\ttype="single"
\t\t\t\t\t\t\tvalue={currentEntry.categoryId}
\t\t\t\t\t\t\tonValueChange={(v) => {
\t\t\t\t\t\t\t\tif (v === '__create__') {
\t\t\t\t\t\t\t\t\tcreateCategory(categoryInput, pendingColor);
\t\t\t\t\t\t\t\t} else if (v) {
\t\t\t\t\t\t\t\t\tupdateEntry({ categoryId: v });
\t\t\t\t\t\t\t\t}
\t\t\t\t\t\t\t}}
\t\t\t\t\t\t>
\t\t\t\t\t\t\t<div class="relative">
\t\t\t\t\t\t\t\t{#if selectedCategory}
\t\t\t\t\t\t\t\t\t<span
\t\t\t\t\t\t\t\t\t\tclass="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full"
\t\t\t\t\t\t\t\t\t\tstyle="background-color: {selectedCategory.color}"
\t\t\t\t\t\t\t\t\t/>
\t\t\t\t\t\t\t\t{/if}
\t\t\t\t\t\t\t\t<Combobox.Input
\t\t\t\t\t\t\t\t\toninput={(e) => { categoryInput = e.currentTarget.value; }}
\t\t\t\t\t\t\t\t\tonfocus={(e) => { categoryInput = ''; e.currentTarget.select(); }}
\t\t\t\t\t\t\t\t\tplaceholder="Search categories..."
\t\t\t\t\t\t\t\t\tclass={cn(
\t\t\t\t\t\t\t\t\t\t'w-full rounded-lg border border-gray-200 bg-white py-2 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30',
\t\t\t\t\t\t\t\t\t\tselectedCategory ? 'pl-8' : 'pl-3'
\t\t\t\t\t\t\t\t\t)}
\t\t\t\t\t\t\t\t/>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<Combobox.Portal>
\t\t\t\t\t\t\t\t<Combobox.Content
\t\t\t\t\t\t\t\t\tposition="popper"
\t\t\t\t\t\t\t\t\tsideOffset={4}
\t\t\t\t\t\t\t\t\tclass="z-[60] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
\t\t\t\t\t\t\t\t\tstyle="width: var(--bits-floating-anchor-width)"
\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t<Combobox.Viewport class="max-h-60 overflow-auto py-1">
\t\t\t\t\t\t\t\t\t\t{#each matchedCategories as cat (cat.id)}
\t\t\t\t\t\t\t\t\t\t\t<Combobox.Item
\t\t\t\t\t\t\t\t\t\t\t\tvalue={cat.id}
\t\t\t\t\t\t\t\t\t\t\t\tlabel={cat.label}
\t\t\t\t\t\t\t\t\t\t\t\tclass="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-sm text-gray-700 data-[highlighted]:bg-gray-100 dark:text-gray-300 dark:data-[highlighted]:bg-gray-800"
\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t<span class="h-3.5 w-3.5 shrink-0 rounded-full" style="background-color: {cat.color}" />
\t\t\t\t\t\t\t\t\t\t\t\t{cat.label}
\t\t\t\t\t\t\t\t\t\t\t</Combobox.Item>
\t\t\t\t\t\t\t\t\t\t{/each}
\t\t\t\t\t\t\t\t\t\t{#if matchedCategories.length === 0 && !showCreateCategory}
\t\t\t\t\t\t\t\t\t\t\t<div class="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">No categories found</div>
\t\t\t\t\t\t\t\t\t\t{/if}
\t\t\t\t\t\t\t\t\t</Combobox.Viewport>

\t\t\t\t\t\t\t\t\t{#if showCreateCategory}
\t\t\t\t\t\t\t\t\t\t<div class="border-t border-gray-100 px-3 py-2 dark:border-gray-800">
\t\t\t\t\t\t\t\t\t\t\t<p class="mb-2 text-[11px] font-medium text-gray-400 dark:text-gray-500">Color</p>
\t\t\t\t\t\t\t\t\t\t\t<div class="flex flex-wrap gap-1.5">
\t\t\t\t\t\t\t\t\t\t\t\t{#each CATEGORY_COLORS as color}
\t\t\t\t\t\t\t\t\t\t\t\t\t<button
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttype="button"
\t\t\t\t\t\t\t\t\t\t\t\t\t\tonmousedown={(e) => { e.preventDefault(); pendingColor = color; }}
\t\t\t\t\t\t\t\t\t\t\t\t\t\tonkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pendingColor = color; } }}
\t\t\t\t\t\t\t\t\t\t\t\t\t\taria-label="Select color"
\t\t\t\t\t\t\t\t\t\t\t\t\t\tclass={cn('h-5 w-5 rounded-full transition-transform hover:scale-110 focus:outline-none', pendingColor === color ? 'ring-2 ring-gray-500 ring-offset-1 dark:ring-gray-300' : '')}
\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="background-color: {color}"
\t\t\t\t\t\t\t\t\t\t\t\t\t/>
\t\t\t\t\t\t\t\t\t\t\t\t{/each}
\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t<Combobox.Item
\t\t\t\t\t\t\t\t\t\t\tvalue="__create__"
\t\t\t\t\t\t\t\t\t\t\tlabel={categoryInput.trim()}
\t\t\t\t\t\t\t\t\t\t\tclass="flex cursor-pointer items-center gap-2 border-t border-gray-100 px-3 py-2 text-sm font-medium text-indigo-600 data-[highlighted]:bg-indigo-50 dark:border-gray-800 dark:text-indigo-400 dark:data-[highlighted]:bg-indigo-900/20"
\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t<span class="h-3.5 w-3.5 shrink-0 rounded-full" style="background-color: {pendingColor}" />
\t\t\t\t\t\t\t\t\t\t\t<Plus size={13} />
\t\t\t\t\t\t\t\t\t\t\tCreate "{categoryInput.trim()}"
\t\t\t\t\t\t\t\t\t\t</Combobox.Item>
\t\t\t\t\t\t\t\t\t{/if}
\t\t\t\t\t\t\t\t</Combobox.Content>
\t\t\t\t\t\t\t</Combobox.Portal>
\t\t\t\t\t\t</Combobox.Root>

\t\t\t\t\t\t{#if showCreatedConfirmation}
\t\t\t\t\t\t\t<p class="mt-1.5 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
\t\t\t\t\t\t\t\t<Check size={11} />
\t\t\t\t\t\t\t\t"{createdCategoryName}" created
\t\t\t\t\t\t\t</p>
\t\t\t\t\t\t{/if}
\t\t\t\t\t</div>
'''
    new_lines = lines[:start] + [replacement] + lines[end+1:]
    with open(path, 'w') as f:
        f.writelines(new_lines)
    print("Done")
