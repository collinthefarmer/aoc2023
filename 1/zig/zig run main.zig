const std = @import("std");

const filename = "../input.txt";

pub fn main() !void {
    const file = try std.fs.cwd().openFile(filename, .{});
    defer file.close();
    const file_reader = file.reader();

    const allocator = std.heap.page_allocator;

    var line = std.ArrayList(u8).init(allocator);
    var line_writer = line.writer();
    defer line.deinit();

    var digits = std.ArrayList(u8).init(allocator);
    defer digits.deinit();

    while (true) {
        file_reader.streamUntilDelimiter(line_writer, '\n', null) catch |err| switch (err) {
            error.EndOfStream => break,
            else => return err,
        };
        try readLineDigits(line.items, &digits);

        std.debug.print("{s}\n", .{digits.items});
        line.clearAndFree();
    }
}

fn readLineDigits(line: []u8, into: *std.ArrayList(u8)) !void {
    var i: u8 = 0;
    while (i < line.len) : (i += 1) {
        if (isDigit(line[i])) {
            try into.append(line[i]);
        }
    }
}

const DIGITS = "0123456789";
fn isDigit(char: u8) bool {
    var i: u8 = 0;
    while (i < DIGITS.len) : (i += 1) {
        if (DIGITS[i] == char) {
            return true;
        }
    }
    return false;
}
