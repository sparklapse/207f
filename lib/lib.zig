const std = @import("std");
const unicode = std.unicode;

const builtin = @import("builtin");

// ====
// 207f
// ====

fn slice_from_raw(ptr: [*]const u8, size: usize) []const u8 {
    const slice = ptr[0..size];
    return slice;
}

const Result = enum(i8) {
    err = -1,
    no,
    yes,
};

// Check if a string is within the 207f range
pub export fn in_range(ptr: [*]const u8, size: usize) Result {
    const string = slice_from_raw(ptr, size);

    const utf8 = unicode.Utf8View.init(string) catch {
        return Result.err;
    };

    var iter = utf8.iterator();
    var char = iter.peek(1);
    while (iter.nextCodepoint()) |code| {
        if (code < 0x20 or code > 0x7f) {
            return Result.no;
        }

        print("{s}", .{char});

        char = iter.peek(1);
    }

    print("\n", .{});
    return Result.yes;
}

// ====================
// Cross platform print
// ====================

fn print(comptime fmt: []const u8, args: anytype) void {
    switch (builtin.os.tag) {
        .freestanding => {
            // TODO: Implement printing for WASM
        },
        else => {
            std.debug.print(fmt, args);
        },
    }
}

// ============
// WASM Helpers
// ============

const wasm_allocator = std.heap.wasm_allocator;

fn alloc(length: u32) callconv(.{ .wasm_mvp = .{} }) [*]const u8 {
    const buffer = wasm_allocator.alloc(u8, length) catch @panic("Could not alloc");
    return buffer.ptr;
}

fn free(ptr: [*]const u8, length: u32) callconv(.{ .wasm_mvp = .{} }) void {
    const buffer = ptr[0..length];
    wasm_allocator.free(buffer);
}

comptime {
    if (builtin.target.cpu.arch == .wasm32) {
        @export(&free, .{ .name = "free", .linkage = .strong });
        @export(&alloc, .{ .name = "alloc", .linkage = .strong });
    }
}
