import { fetchTasks } from "../apiService";
import { renderTasks } from "../renderService/renderIndex";
import { applyFilters, applySort } from "../filterSortService";
import { Member } from "../../models/members";

/**
 * Applies filter and sorting to the tasks and renders the updated list.
 * @param {Member[]} members - The array of members 
 */
export async function applyFiltersAndSort(members: Member[]) {
    const filters = {
        memberId: (document.getElementById("filter-member") as HTMLSelectElement)?.value,
        category: (document.getElementById("filter-category") as HTMLSelectElement)?.value,
    };
    const sort = {
        field: (document.getElementById("sort-field") as HTMLSelectElement)?.value,
        order: (document.getElementById("sort-order") as HTMLSelectElement)?.value,
    };
    const tasks = await fetchTasks();
    const filteredTasks = applyFilters(tasks, filters);
    const sortedTasks = applySort(filteredTasks, sort);
    renderTasks(sortedTasks, members);
}