import { fetchTasks, fetchMembers, addTask, addMember } from "./apiService";
import { renderTasks } from "./renderService";
import { applyFilters, applySort } from "./filterSortService";
import { Task } from "../models/tasks";
import { Member } from "../models/members";

export async function setupEventListeners() {
    const tasks: Task[] = await fetchTasks();
    const members: Member[] = await fetchMembers();

    renderTasks(tasks, members);
    populateFilterMemberSelect(members);

    const addTaskForm = document.getElementById("add-task-form") as HTMLFormElement;
    if (addTaskForm) {
        addTaskForm.addEventListener("submit", (event) => {
            event.preventDefault();
            handleAddTask();
        });
    }

    const addMemberForm = document.getElementById("add-member-form") as HTMLFormElement;
    if (addMemberForm) {
        addMemberForm.addEventListener("submit", (event) => {
            event.preventDefault();
            handleAddMember();
        });
    }

    document.getElementById("filter-member")?.addEventListener("change", applyFiltersAndSort);
    document.getElementById("filter-category")?.addEventListener("change", applyFiltersAndSort);
    document.getElementById("sort-field")?.addEventListener("change", applyFiltersAndSort);
    document.getElementById("sort-order")?.addEventListener("change", applyFiltersAndSort);

    async function handleAddTask() {
        const title = (document.getElementById("task-input") as HTMLInputElement).value;
        const description = (document.getElementById("task-description") as HTMLInputElement).value;
        const category = (document.getElementById("task-category") as HTMLSelectElement).value as "ux" | "frontend" | "backend" | "none";
        const priority = (document.getElementById("task-priority") as HTMLSelectElement).value as "low" | "medium" | "high";
        const parentId = (document.getElementById("parent-task") as HTMLSelectElement).value || undefined;

        if (title && description && category !== "none") {
            const newTask = {
                title,
                description,
                category,
                priority,
                parentId,
            } as Partial<Task>;
            await addTask(newTask);
            const updatedTasks = await fetchTasks();
            renderTasks(updatedTasks, members);
            highlightElement(document.querySelector(".add-task"));
        }
    }

    async function handleAddMember() {
        const name = (document.getElementById("member-input") as HTMLInputElement).value;
        const roles = Array.from(document.querySelectorAll('.add-member input[type="checkbox"]:checked') as NodeListOf<HTMLInputElement>).map((checkbox) => checkbox.value) as ("ux" | "frontend" | "backend")[];

        if (name && roles.length > 0) {
            const invalidRoles = roles.filter((role) => !["ux", "frontend", "backend"].includes(role));
            if (invalidRoles.length) {
                alert(`Invalid roles: ${invalidRoles.join(", ")}`);
                return;
            }

            const newMember = {
                name,
                roles,
            } as Partial<Member>;

            console.log("Adding new member:", newMember);

            try {
                await addMember(newMember);
                const updatedMembers = await fetchMembers();
                const updatedTasks = await fetchTasks();
                renderTasks(updatedTasks, updatedMembers);
                populateFilterMemberSelect(updatedMembers);
                highlightElement(document.querySelector(".add-member"));
            } catch (error) {
                console.error("Failed to add member:", error);
            }
        }
    }

    async function applyFiltersAndSort() {
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

    function highlightElement(element: Element | null) {
        if (element) {
            element.classList.add("highlight");
            setTimeout(() => {
                element.classList.remove("highlight");
            }, 2000);
        }
    }

    function populateFilterMemberSelect(members: Member[]) {
        const filterMemberSelect = document.getElementById("filter-member");
        if (filterMemberSelect) {
            filterMemberSelect.innerHTML = '<option value="">Select Member</option>';
            members.forEach((member) => {
                const option = document.createElement("option");
                option.value = member.id;
                option.textContent = member.name;
                filterMemberSelect.appendChild(option);
            });
        }
    }
}