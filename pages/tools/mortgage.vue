<script setup lang="ts">
const tool = useToolSeo('mortgage');

type LoanKind = 'commercial' | 'fund' | 'combo';
type RepayMethod = 'equal-payment' | 'equal-principal';

interface ScheduleRow {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    remaining: number;
}

interface LoanResult {
    firstPayment: number;
    lastPayment: number;
    totalPayment: number;
    totalInterest: number;
    schedule: ScheduleRow[];
}

const loanKind = ref<LoanKind>('commercial');
const repayMethod = ref<RepayMethod>('equal-payment');
const years = ref(30);

const commercialWan = ref(100);
const commercialRate = ref(3.1);
const fundWan = ref(50);
const fundRate = ref(2.6);

const showFullSchedule = ref(false);
const schedulePageSize = 10;

const loanKinds: Array<{ id: LoanKind; label: string }> = [
    { id: 'commercial', label: '商业贷' },
    { id: 'fund', label: '公积金' },
    { id: 'combo', label: '组合贷' },
];

const repayMethods: Array<{ id: RepayMethod; label: string }> = [
    { id: 'equal-payment', label: '等额本息' },
    { id: 'equal-principal', label: '等额本金' },
];

const yearPresets = [5, 10, 15, 20, 25, 30];

function round2(n: number) {
    return Math.round(n * 100) / 100;
}

function formatMoney(n: number) {
    return n.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function calcLoan(principalYuan: number, annualRatePercent: number, months: number, method: RepayMethod): LoanResult | null {
    if (!(principalYuan > 0) || !(months > 0) || annualRatePercent < 0) {
        return null;
    }

    const monthlyRate = annualRatePercent / 100 / 12;
    const schedule: ScheduleRow[] = [];
    let remaining = principalYuan;
    let totalPayment = 0;
    let totalInterest = 0;

    if (method === 'equal-payment') {
        if (monthlyRate === 0) {
            const payment = principalYuan / months;
            for (let month = 1; month <= months; month += 1) {
                const principal = month === months ? remaining : payment;
                remaining = Math.max(0, remaining - principal);
                schedule.push({
                    month,
                    payment: round2(principal),
                    principal: round2(principal),
                    interest: 0,
                    remaining: round2(remaining),
                });
                totalPayment += principal;
            }
        } else {
            const factor = (1 + monthlyRate) ** months;
            const payment = (principalYuan * monthlyRate * factor) / (factor - 1);
            for (let month = 1; month <= months; month += 1) {
                const interest = remaining * monthlyRate;
                let principal = payment - interest;
                if (month === months) {
                    principal = remaining;
                }
                const actualPayment = principal + interest;
                remaining = Math.max(0, remaining - principal);
                schedule.push({
                    month,
                    payment: round2(actualPayment),
                    principal: round2(principal),
                    interest: round2(interest),
                    remaining: round2(remaining),
                });
                totalPayment += actualPayment;
                totalInterest += interest;
            }
        }
    } else {
        const monthlyPrincipal = principalYuan / months;
        for (let month = 1; month <= months; month += 1) {
            const interest = remaining * monthlyRate;
            let principal = monthlyPrincipal;
            if (month === months) {
                principal = remaining;
            }
            const payment = principal + interest;
            remaining = Math.max(0, remaining - principal);
            schedule.push({
                month,
                payment: round2(payment),
                principal: round2(principal),
                interest: round2(interest),
                remaining: round2(remaining),
            });
            totalPayment += payment;
            totalInterest += interest;
        }
    }

    return {
        firstPayment: schedule[0]?.payment ?? 0,
        lastPayment: schedule.at(-1)?.payment ?? 0,
        totalPayment: round2(totalPayment),
        totalInterest: round2(totalInterest),
        schedule,
    };
}

function mergeSchedules(parts: LoanResult[]): LoanResult | null {
    if (!parts.length) {
        return null;
    }
    if (parts.length === 1) {
        return parts[0]!;
    }

    const months = Math.max(...parts.map(part => part.schedule.length));
    const schedule: ScheduleRow[] = [];
    let totalPayment = 0;
    let totalInterest = 0;

    for (let month = 1; month <= months; month += 1) {
        let payment = 0;
        let principal = 0;
        let interest = 0;
        let remaining = 0;
        for (const part of parts) {
            const row = part.schedule[month - 1];
            if (!row) {
                continue;
            }
            payment += row.payment;
            principal += row.principal;
            interest += row.interest;
            remaining += row.remaining;
        }
        schedule.push({
            month,
            payment: round2(payment),
            principal: round2(principal),
            interest: round2(interest),
            remaining: round2(remaining),
        });
        totalPayment += payment;
        totalInterest += interest;
    }

    return {
        firstPayment: schedule[0]?.payment ?? 0,
        lastPayment: schedule.at(-1)?.payment ?? 0,
        totalPayment: round2(totalPayment),
        totalInterest: round2(totalInterest),
        schedule,
    };
}

const months = computed(() => Math.min(600, Math.max(1, Math.round(Number(years.value) || 1) * 12)));

const inputError = computed(() => {
    const y = Number(years.value);
    if (!(y > 0) || y > 50) {
        return '贷款年限请填写 1–50 年';
    }
    if (loanKind.value === 'commercial') {
        if (!(Number(commercialWan.value) > 0)) {
            return '请填写商业贷款金额';
        }
        if (Number(commercialRate.value) < 0) {
            return '利率不能为负数';
        }
    } else if (loanKind.value === 'fund') {
        if (!(Number(fundWan.value) > 0)) {
            return '请填写公积金贷款金额';
        }
        if (Number(fundRate.value) < 0) {
            return '利率不能为负数';
        }
    } else {
        if (!(Number(commercialWan.value) > 0) && !(Number(fundWan.value) > 0)) {
            return '组合贷至少填写一笔金额';
        }
        if (Number(commercialRate.value) < 0 || Number(fundRate.value) < 0) {
            return '利率不能为负数';
        }
    }
    return '';
});

const result = computed(() => {
    if (inputError.value) {
        return null;
    }

    const method = repayMethod.value;
    const n = months.value;
    const parts: LoanResult[] = [];

    if (loanKind.value === 'commercial' || loanKind.value === 'combo') {
        const principal = Number(commercialWan.value) * 10_000;
        if (principal > 0) {
            const part = calcLoan(principal, Number(commercialRate.value) || 0, n, method);
            if (part) {
                parts.push(part);
            }
        }
    }

    if (loanKind.value === 'fund' || loanKind.value === 'combo') {
        const principal = Number(fundWan.value) * 10_000;
        if (principal > 0) {
            const part = calcLoan(principal, Number(fundRate.value) || 0, n, method);
            if (part) {
                parts.push(part);
            }
        }
    }

    return mergeSchedules(parts);
});

const totalPrincipal = computed(() => {
    let wan = 0;
    if (loanKind.value === 'commercial' || loanKind.value === 'combo') {
        wan += Math.max(0, Number(commercialWan.value) || 0);
    }
    if (loanKind.value === 'fund' || loanKind.value === 'combo') {
        wan += Math.max(0, Number(fundWan.value) || 0);
    }
    return round2(wan * 10_000);
});

const visibleSchedule = computed(() => {
    if (!result.value) {
        return [];
    }
    if (showFullSchedule.value) {
        return result.value.schedule;
    }
    return result.value.schedule.slice(0, schedulePageSize);
});

const paymentLabel = computed(() => {
    if (!result.value) {
        return '月供';
    }
    if (repayMethod.value === 'equal-payment') {
        return '每月还款';
    }
    return '首月还款';
});

watch([loanKind, repayMethod, years, commercialWan, commercialRate, fundWan, fundRate], () => {
    showFullSchedule.value = false;
});
</script>

<template>
    <div>
        <p class="text-sm text-moss">
            <NuxtLink to="/tools" class="hover:underline">实用工具</NuxtLink>
            <span class="mx-1.5 text-stone-400">/</span>
            房贷
        </p>
        <h1 class="mt-2 text-3xl font-semibold tracking-tight">{{ tool.title }}</h1>
        <p class="mt-4 max-w-3xl leading-8 text-stone-700">
            按金额、年限与年利率估算月供、总利息与还款明细。支持等额本息 /
            等额本金，以及商业贷、公积金与组合贷。结果仅供参考，以银行合同为准。
        </p>

        <div class="mt-8 flex flex-wrap gap-2">
            <button
                v-for="item in loanKinds"
                :key="item.id"
                type="button"
                class="rounded-xl border px-3 py-1.5 text-sm transition"
                :class="
                    loanKind === item.id
                        ? 'border-moss bg-moss text-white'
                        : 'border-stone-300/80 bg-white/60 text-stone-700 hover:border-moss/50'
                "
                @click="loanKind = item.id"
            >
                {{ item.label }}
            </button>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
            <button
                v-for="item in repayMethods"
                :key="item.id"
                type="button"
                class="rounded-xl border px-3 py-1.5 text-sm transition"
                :class="
                    repayMethod === item.id
                        ? 'border-moss bg-moss text-white'
                        : 'border-stone-300/80 bg-white/60 text-stone-700 hover:border-moss/50'
                "
                @click="repayMethod = item.id"
            >
                {{ item.label }}
            </button>
        </div>

        <section class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label v-if="loanKind === 'commercial' || loanKind === 'combo'" class="block">
                <span class="mb-1.5 block text-sm text-stone-600">
                    {{ loanKind === 'combo' ? '商业贷金额（万元）' : '贷款金额（万元）' }}
                </span>
                <input
                    v-model.number="commercialWan"
                    type="number"
                    min="0"
                    step="1"
                    class="w-full rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 text-ink outline-none ring-moss/30 focus:ring-2"
                />
            </label>

            <label v-if="loanKind === 'commercial' || loanKind === 'combo'" class="block">
                <span class="mb-1.5 block text-sm text-stone-600">
                    {{ loanKind === 'combo' ? '商业贷年利率（%）' : '年利率（%）' }}
                </span>
                <input
                    v-model.number="commercialRate"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 text-ink outline-none ring-moss/30 focus:ring-2"
                />
            </label>

            <label v-if="loanKind === 'fund' || loanKind === 'combo'" class="block">
                <span class="mb-1.5 block text-sm text-stone-600">
                    {{ loanKind === 'combo' ? '公积金金额（万元）' : '贷款金额（万元）' }}
                </span>
                <input
                    v-model.number="fundWan"
                    type="number"
                    min="0"
                    step="1"
                    class="w-full rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 text-ink outline-none ring-moss/30 focus:ring-2"
                />
            </label>

            <label v-if="loanKind === 'fund' || loanKind === 'combo'" class="block">
                <span class="mb-1.5 block text-sm text-stone-600">
                    {{ loanKind === 'combo' ? '公积金年利率（%）' : '年利率（%）' }}
                </span>
                <input
                    v-model.number="fundRate"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 text-ink outline-none ring-moss/30 focus:ring-2"
                />
            </label>

            <div class="block sm:col-span-2 lg:col-span-1">
                <span class="mb-1.5 block text-sm text-stone-600">贷款年限（年）</span>
                <input
                    v-model.number="years"
                    type="number"
                    min="1"
                    max="50"
                    class="w-full rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 text-ink outline-none ring-moss/30 focus:ring-2"
                />
                <div class="mt-2 flex flex-wrap gap-1.5">
                    <button
                        v-for="preset in yearPresets"
                        :key="preset"
                        type="button"
                        class="rounded-lg border px-2 py-0.5 text-xs transition"
                        :class="
                            years === preset
                                ? 'border-moss/40 bg-moss/10 text-moss'
                                : 'border-stone-300/80 text-stone-600 hover:border-moss/40'
                        "
                        @click="years = preset"
                    >
                        {{ preset }} 年
                    </button>
                </div>
            </div>
        </section>

        <p v-if="inputError" class="mt-4 text-sm text-red-700">{{ inputError }}</p>

        <section v-if="result" class="mt-8">
            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div class="rounded-2xl border border-moss/30 bg-moss/5 px-4 py-4">
                    <p class="text-sm text-moss">{{ paymentLabel }}</p>
                    <p class="mt-1 text-2xl font-semibold tracking-tight text-ink">
                        {{ formatMoney(result.firstPayment) }}
                        <span class="text-sm font-normal text-stone-500">元</span>
                    </p>
                    <p v-if="repayMethod === 'equal-principal'" class="mt-1 text-xs text-stone-500">
                        末月 {{ formatMoney(result.lastPayment) }} 元
                    </p>
                </div>
                <div class="rounded-2xl border border-stone-300/80 bg-white/60 px-4 py-4">
                    <p class="text-sm text-stone-600">贷款本金</p>
                    <p class="mt-1 text-2xl font-semibold tracking-tight">
                        {{ formatMoney(totalPrincipal) }}
                        <span class="text-sm font-normal text-stone-500">元</span>
                    </p>
                </div>
                <div class="rounded-2xl border border-stone-300/80 bg-white/60 px-4 py-4">
                    <p class="text-sm text-stone-600">支付利息</p>
                    <p class="mt-1 text-2xl font-semibold tracking-tight">
                        {{ formatMoney(result.totalInterest) }}
                        <span class="text-sm font-normal text-stone-500">元</span>
                    </p>
                </div>
                <div class="rounded-2xl border border-stone-300/80 bg-white/60 px-4 py-4">
                    <p class="text-sm text-stone-600">还款总额</p>
                    <p class="mt-1 text-2xl font-semibold tracking-tight">
                        {{ formatMoney(result.totalPayment) }}
                        <span class="text-sm font-normal text-stone-500">元</span>
                    </p>
                    <p class="mt-1 text-xs text-stone-500">共 {{ months }} 期</p>
                </div>
            </div>

            <div class="mt-8 flex flex-col gap-8">
                <div class="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h2 class="text-lg font-semibold tracking-tight">还款明细</h2>
                        <p class="mt-1 text-sm text-stone-600">
                            {{ repayMethod === 'equal-payment' ? '每月还款额固定，前期利息占比更高。' : '每月本金固定，月供逐月递减。' }}
                        </p>
                    </div>
                    <button
                        v-if="result.schedule.length > schedulePageSize"
                        type="button"
                        class="text-sm text-moss hover:underline"
                        @click="showFullSchedule = !showFullSchedule"
                    >
                        {{ showFullSchedule ? '收起' : `展开全部 ${result.schedule.length} 期` }}
                    </button>
                </div>

                <div class="mt-1 w-full overflow-x-auto rounded-2xl border border-stone-300/80 bg-white/60">
                    <table class="w-full table-fixed text-left text-sm">
                        <colgroup>
                            <col class="w-[12%]" />
                            <col class="w-[22%]" />
                            <col class="w-[22%]" />
                            <col class="w-[22%]" />
                            <col class="w-[22%]" />
                        </colgroup>
                        <thead class="border-b border-stone-300/80 bg-stone-200/40 text-stone-600">
                            <tr>
                                <th class="px-4 py-3 font-medium">期数</th>
                                <th class="px-4 py-3 font-medium">月供（元）</th>
                                <th class="px-4 py-3 font-medium">本金（元）</th>
                                <th class="px-4 py-3 font-medium">利息（元）</th>
                                <th class="px-4 py-3 font-medium">剩余本金（元）</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in visibleSchedule" :key="row.month" class="border-b border-stone-200/80 last:border-0">
                                <td class="px-4 py-2.5 text-stone-700">{{ row.month }}</td>
                                <td class="px-4 py-2.5 tabular-nums">{{ formatMoney(row.payment) }}</td>
                                <td class="px-4 py-2.5 tabular-nums text-stone-700">{{ formatMoney(row.principal) }}</td>
                                <td class="px-4 py-2.5 tabular-nums text-stone-700">{{ formatMoney(row.interest) }}</td>
                                <td class="px-4 py-2.5 tabular-nums text-stone-700">{{ formatMoney(row.remaining) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    </div>
</template>
